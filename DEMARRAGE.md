# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## ⚡ Installation Express (5 minutes)

### 1. Installer les dépendances

```bash
cd bail-tal-coop
npm install
```

### 2. Configurer Supabase

**Option A - Base de données existante:**

Vous avez déjà la base de données configurée! Ajustez juste le fichier `.env.local`:

```bash
cp .env.example .env.local
```

Éditez `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
```

**Option B - Nouvelle base de données:**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Dans SQL Editor, exécutez: `schema_bail_tal_coop_v1.1.sql`
4. Configurez `.env.local` comme ci-dessus

### 3. Lancer l'application

```bash
npm run dev
```

🎉 **C'EST PRÊT!** Ouvrez http://localhost:3000

---

## 📋 Checklist de vérification

- [ ] Node.js 18+ installé
- [ ] Dépendances npm installées
- [ ] Variables d'environnement configurées
- [ ] Base de données Supabase prête
- [ ] Serveur lancé sur http://localhost:3000

---

## 🎯 Prochaines étapes

### 1. **Tester le formulaire**
- Naviguez dans les sections
- Remplissez les champs
- Testez la sauvegarde

### 2. **Personnaliser**
- Modifiez les couleurs dans `tailwind.config.ts`
- Ajoutez votre logo dans le header
- Adaptez les textes selon vos besoins

### 3. **Compléter les sections manquantes**
Les sections suivantes sont à compléter:
- Section B (Description du logement) - EN COURS
- Section C (Durée du bail)
- Section D (Loyer)
- Section E (Services et conditions)
- Section F (Restrictions)
- Section H (Solidarité et caution)
- Finalisation (PDF + Signatures)

---

## 🐛 Problèmes courants

### Erreur: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur Supabase
Vérifiez que:
- Les URLs dans `.env.local` sont correctes
- La clé API est la clé **publique** (anon)
- Le schéma SQL a été exécuté

### Port 3000 déjà utilisé
```bash
npm run dev -- -p 3001
```

---

## 📞 Support

**Besoin d'aide?**
- Consultez le `README.md` complet
- Vérifiez les commentaires dans le code
- Référez-vous à la documentation Supabase

---

**Bon développement! 🎉**
