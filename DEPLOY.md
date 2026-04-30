# Déploiement AnimAction33

## Vue d'ensemble

- **Hébergement** : Netlify (build automatique sur push GitHub)
- **Emails** : Resend (formulaire de contact + accusés de réception)
- **Persistance bons de réduction** : Firestore (Firebase)
- **Auth admin** : cookie HTTP-only signé par mot de passe en variable d'env

---

## 1. Configurer Firebase Firestore

### a) Créer le projet
1. Va sur https://console.firebase.google.com/
2. **Add project** → nomme-le `animaction33` (ou autre)
3. Désactive Google Analytics (pas utile ici)

### b) Activer Firestore
1. Sidebar → **Build** → **Firestore Database**
2. **Create database** → mode **Native** (pas Datastore)
3. Region : `eur3 (europe-west)` (proche de Libourne)
4. Démarrer en **mode production** (règles ci-dessous)

### c) Règles de sécurité
Dans **Firestore → Rules**, colle :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Aucun accès direct depuis le navigateur — tout passe par l'API serveur
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Le serveur Next.js utilise le **Service Account** (clé privée) qui contourne ces règles.

### d) Récupérer la clé Service Account
1. **Project Settings** (engrenage) → **Service accounts**
2. **Generate new private key** → télécharge le JSON
3. Ouvre le JSON, repère ces 3 valeurs :
   - `project_id`
   - `client_email`
   - `private_key`

---

## 2. Configurer Resend

1. Crée un compte sur https://resend.com
2. **API Keys** → **Create API Key** (rôle "Sending")
3. **Domains** → ajoute `animaction33.fr` et configure les enregistrements DNS (SPF, DKIM)
4. Note la clé `re_xxxxxxxx`

---

## 3. Déployer sur Netlify

### a) Connecter le repo
1. https://app.netlify.com/ → **Add new site** → **Import from Git**
2. Choisis GitHub → autorise → sélectionne `gwenviet33-max/animaction33`
3. Branch : `main` (ou la branche par défaut)
4. Build settings :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
5. **Show advanced** → **New variable** → ajoute toutes les variables ci-dessous

### b) Variables d'environnement Netlify

Dans **Site configuration → Environment variables**, ajoute :

| Clé | Valeur | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | `<mot de passe fort>` | Pour /admin/login |
| `RESEND_API_KEY` | `re_xxxxxxxx` | Resend |
| `EMAIL_TO` | `contact@animaction33.fr` | Destinataire des leads |
| `EMAIL_FROM` | `AnimAction33 <noreply@animaction33.fr>` | Adresse d'envoi (doit matcher le domaine validé Resend) |
| `NEXT_PUBLIC_SITE_URL` | `https://animaction33.fr` | Url canonique |
| `NEXT_PUBLIC_GOOGLE_REVIEW_LINK` | `https://g.page/r/...` | Lien avis Google |
| `NEXT_PUBLIC_WA_NUMBER` | `33677243675` | WhatsApp international |
| `FIREBASE_PROJECT_ID` | `animaction33` | Du JSON service account |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@...iam.gserviceaccount.com` | Du JSON |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMII...==\n-----END PRIVATE KEY-----\n"` | **Avec les guillemets**, et `\n` littéraux (pas de vrais retours à la ligne) |

⚠️ **Important pour `FIREBASE_PRIVATE_KEY`** : Netlify gère mal les retours à la ligne. Le code remplace automatiquement les `\n` (deux caractères) par des vrais retours à la ligne au runtime. Donc dans Netlify, colle la clé telle qu'elle apparaît dans le JSON (avec les `\n` littéraux).

### c) Déclencher le déploiement
- Clique **Deploy site**
- Le build prend ~2 min
- Une fois en ligne : `https://<random>.netlify.app`

### d) Configurer le domaine personnalisé
1. **Domain settings** → **Add custom domain** → `animaction33.fr`
2. Suis les instructions DNS (CNAME ou nameservers Netlify)
3. Active **HTTPS** (gratuit via Let's Encrypt, automatique)

---

## 4. Vérifier le déploiement

Une fois en ligne, teste :

- [ ] **Homepage** s'affiche stylée (pas de page blanche/non-stylée)
- [ ] **Splash screen** disparaît au bout de 2,8 s
- [ ] **Mini-jeu** : casse toutes les briques sans perdre de vie → un code `ANIM-XXXX-XXXX` s'affiche
- [ ] **Formulaire contact** : envoie un test depuis ton propre email → tu reçois la confirmation + Gwen reçoit le récap
- [ ] **Code promo** : copie le code gagné, va sur `/contact?code=...` → champ pré-rempli, badge "Code valide" en vert
- [ ] **Admin** : `/admin/login` avec ton `ADMIN_PASSWORD` → tableau de bord
- [ ] **Bons** : `/admin/coupons` → tu vois le code de test, son statut "Utilisé" + qui l'a redeem
- [ ] **Sitemap** : `https://animaction33.fr/sitemap.xml` accessible
- [ ] **Robots** : `https://animaction33.fr/robots.txt` accessible, /admin disallowed

---

## 5. Migration de la donnée filesystem → Firestore

Si tu as testé en local et que tu as déjà des coupons dans `.data/coupons.json` :

```bash
# Lance le serveur dev avec Firebase configuré
npm run dev

# Puis dans une seconde fenêtre, exécute le script de migration (à créer si besoin)
# Pour l'instant, tu peux juste recommencer à zéro en prod : les coupons sont à usage unique
```

En pratique, oublie la migration : les coupons gagnés en local pendant le dev ne valent rien en prod. Tu repars d'une base vide.

---

## 6. Maintenance

### Mettre à jour le site
```bash
git push origin main
# → Netlify re-build automatiquement (~2 min)
```

### Voir les coupons émis
- `/admin/coupons` (interface)
- Ou directement Firestore Console : https://console.firebase.google.com/project/animaction33/firestore/data/~2Fcoupons

### Changer le mot de passe admin
- **Site configuration → Environment variables → ADMIN_PASSWORD** → modifier la valeur
- **Deploys → Trigger deploy → Clear cache and deploy site** (force un rebuild pour appliquer)

### Voir les emails envoyés
- Dashboard Resend : https://resend.com/emails

### Logs serveur
- Netlify → **Functions → Logs** (tout ce qui passe par /api/* y apparaît)

---

## 7. Problèmes courants

### "Failed to send email" lors d'un envoi de formulaire
→ Vérifie que `EMAIL_FROM` matche un domaine validé dans Resend (sinon ils refusent l'envoi)

### "Cannot find module firebase-admin"
→ Lance `npm install --legacy-peer-deps` puis re-deploy

### Codes promo non persistés en prod
→ Les 3 variables `FIREBASE_*` ne sont pas configurées dans Netlify, l'app retombe sur le filesystem qui n'est PAS persistant. Configure Firebase et re-deploy.

### Build Netlify échoue avec "ENOENT: pages-manifest.json"
→ C'est l'erreur iCloud (uniquement en local sur Desktop macOS). Sur Netlify ça ne se produit pas. Si ça arrive sur Netlify, ouvre une issue.

---

## 8. Architecture en bref

```
Browser
  ├─ Site public (statique, prerendered)
  ├─ /contact → POST /api/contact
  │     └─→ verify code in Firestore + Resend send + redeem code
  ├─ /admin/* → middleware (cookie aa_admin_session)
  │     ├─ /admin/coupons → GET /api/coupons (list from Firestore)
  │     └─ /admin/* → localStorage admin store (no server)
  └─ Mini-jeu → POST /api/coupons/issue (generate + store in Firestore)

Firestore
  └─ coupons/{code} → { amount, minOrder, used, usedAt, usedBy, ip, createdAt }
```

Tout le reste (témoignages, photos galerie, prestations actives, bandeau, paramètres) est stocké en **localStorage** côté admin, donc par appareil. Si tu modifies depuis ton iPhone, ça ne se voit pas sur ton ordi. Pour synchroniser, prochaine étape : migrer aussi ces données dans Firestore (collection `content/<section>`).
