import { useEffect, useCallback, useRef } from 'react';
import { useCanvasSessionStore } from '../store/useCanvasSessionStore';
import { useAuthStore } from '../store/useAuthStore';
import {
    subscribeToCanvas,
    updateCanvasObjects,
    updateUserPresence
} from '../services/firestoreSync';
import type { CanvasSession } from '../models/CanvasSession';

interface UseCanvasSyncOptions {
    canvasRef: React.RefObject<any>;
    onCanvasUpdate?: (session: CanvasSession) => void;
}

export const useCanvasSync = ({ canvasRef, onCanvasUpdate }: UseCanvasSyncOptions) => {
    const { currentSessionId } = useCanvasSessionStore();
    const { user } = useAuthStore();
    const isUpdatingFromFirestore = useRef(false);
    const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Subscribe to canvas changes from Firestore
    useEffect(() => {
        if (!currentSessionId) return;

        const unsubscribe = subscribeToCanvas(
            currentSessionId,
            (session) => {
                if (!canvasRef.current) return;

                // Prevent infinite loop
                isUpdatingFromFirestore.current = true;

                // Update canvas from Firestore data
                const canvas = canvasRef.current;
                const fabricObjects = Object.values(session.objects || {});

                // Clear existing objects
                canvas.clear();

                // Load objects from Firestore
                fabricObjects.forEach((obj: any) => {
                    if (obj && obj.type) {
                        // Reconstruct Fabric object from serialized data
                        canvas.add(obj);
                    }
                });

                canvas.renderAll();

                onCanvasUpdate?.(session);

                // Reset flag after a short delay
                setTimeout(() => {
                    isUpdatingFromFirestore.current = false;
                }, 100);
            },
            (error) => {
                console.error('Canvas sync error:', error);
            }
        );

        return () => unsubscribe();
    }, [currentSessionId, canvasRef, onCanvasUpdate]);

    // Update presence periodically
    useEffect(() => {
        if (!currentSessionId || !user) return;

        // Initial presence
        updateUserPresence(
            currentSessionId,
            user.uid,
            user.displayName || user.email || 'Anonymous',
            user.photoURL || undefined
        );

        // Update every 10 seconds
        const interval = setInterval(() => {
            updateUserPresence(
                currentSessionId,
                user.uid,
                user.displayName || user.email || 'Anonymous',
                user.photoURL || undefined
            );
        }, 10000);

        return () => clearInterval(interval);
    }, [currentSessionId, user]);

    // Sync local changes to Firestore
    const syncToFirestore = useCallback(
        (objects: any[]) => {
            if (!currentSessionId || isUpdatingFromFirestore.current) return;

            // Clear existing timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Debounce updates to avoid excessive writes
            updateTimeoutRef.current = setTimeout(() => {
                const objectsMap: Record<string, any> = {};
                objects.forEach((obj, index) => {
                    objectsMap[obj.id || `obj_${index}`] = obj.toObject();
                });

                updateCanvasObjects(currentSessionId, objectsMap).catch((error) => {
                    console.error('Failed to sync to Firestore:', error);
                });
            }, 300); // 300ms debounce
        },
        [currentSessionId]
    );

    return {
        syncToFirestore,
    };
};
