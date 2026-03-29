# Automated Deployment Workflow

## 🚀 Vercel Project Info
- **Project ID**: `prj_HEwhJCAWDoNGjwgU1AEieQnHiBGK`
- **Production URL**: https://studio-tool-demo.vercel.app
- **GitHub Repo**: https://github.com/egehandogandsk-blip/StudioTool_Demo

---

## ✅ Automated Deployment Setup

### GitHub → Vercel Integration
Vercel is now configured to automatically deploy on every push to GitHub:

1. **Main Branch**: Automatic production deployment
2. **Other Branches**: Automatic preview deployments
3. **Pull Requests**: Preview deployments with unique URLs

### Deployment Trigger
```bash
# Make changes locally
git add .
git commit -m "feat: your changes"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Starts build
# 3. Deploys to production
# 4. Takes 2-3 minutes
```

---

## 📋 Post-Deployment Configuration Needed

### 1. Clerk Configuration
Update Clerk dashboard with production URL:

1. Go to: https://dashboard.clerk.com
2. Select your app
3. **Settings** → **Domains**
4. Add: `studio-tool-demo.vercel.app`
5. **Paths** (verify):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

### 2. Stripe Webhook Configuration
1. Go to: https://dashboard.stripe.com/webhooks
2. **Add endpoint**: `https://studio-tool-demo.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Signing Secret**
5. Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`
6. Redeploy via: `git commit --allow-empty -m "chore: trigger redeploy" && git push`

### 3. Stripe Product Setup
Create products and update price IDs in Vercel environment variables:

**Create Products:**
- Forge Starter: $9/month → `STRIPE_PRICE_STARTER`
- Forge Pro: $29/month → `STRIPE_PRICE_PRO`
- Forge Studio: $99/month → `STRIPE_PRICE_STUDIO`

**Update Vercel Env:**
1. https://vercel.com/egehandogandsk-blip/studio-tool-demo/settings/environment-variables
2. Add the 3 price IDs
3. Redeploy

---

## 🔄 Development Workflow

### Standard Flow
```bash
# 1. Make changes in VS Code
# 2. Test locally
npm run dev:all

# 3. Commit and push
git add .
git commit -m "feat: description"
git push origin main

# 4. Vercel auto-deploys (monitor at vercel.com/dashboard)
# 5. Check production: https://studio-tool-demo.vercel.app
```

### Emergency Rollback
```bash
# Via Vercel Dashboard
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "Promote to Production"
```

### Manual Redeploy
```bash
# If auto-deploy fails
vercel --prod
```

---

## 🧪 Testing Production

### Quick Checks
- [ ] Visit https://studio-tool-demo.vercel.app
- [ ] Sign up with email
- [ ] Sign in with Google
- [ ] Create a project
- [ ] Check Supabase for user record
- [ ] Test subscription upgrade
- [ ] Publish a project
- [ ] Access public URL

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: https://vercel.com/egehandogandsk-blip/studio-tool-demo/deployments
- **Analytics**: https://vercel.com/egehandogandsk-blip/studio-tool-demo/analytics
- **Logs**: https://vercel.com/egehandogandsk-blip/studio-tool-demo/logs

### Build Status
Every push shows:
- ✅ Building → Running → Ready (success)
- ❌ Building → Failed (click for logs)

---

## ⚡ Next Steps

1. **Configure Clerk domain** (5 minutes)
2. **Setup Stripe webhook** (5 minutes)
3. **Test live deployment** (10 minutes)
4. **Make a test change** to verify auto-deploy

---

**Status**: Production deployment successful, auto-deploy configured  
**Last Updated**: 2026-02-16 09:58 UTC
