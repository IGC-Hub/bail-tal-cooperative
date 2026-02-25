#!/bin/bash
# Script de déploiement GitHub pour bail-tal-cooperative
# IGC Hub - 2026

echo "🚀 Déploiement sur GitHub IGC-Hub"
echo "=================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le dossier bail-tal-cooperative"
    exit 1
fi

# Vérifier que Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Erreur: Git n'est pas installé"
    exit 1
fi

echo "✅ Vérifications préliminaires OK"
echo ""

# Initialiser Git
echo "📦 Initialisation de Git..."
git init

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Premier commit
echo "💾 Premier commit..."
git commit -m "🎉 Initial commit - Formulaire de bail TAL pour coopératives

- Interface Next.js 14 conforme au formulaire TAL officiel
- Intégration Supabase complète
- Sections A (Identification) implémentées
- Composants UI réutilisables
- Documentation complète
- Types TypeScript exhaustifs

Développé par IGC Hub pour les coopératives d'habitation du Québec"

# Demander le nom du repository
echo ""
echo "📋 Configuration GitHub..."
read -p "Nom du repository [bail-tal-cooperative]: " REPO_NAME
REPO_NAME=${REPO_NAME:-bail-tal-cooperative}

# Ajouter le remote
echo "🔗 Connexion à GitHub IGC-Hub..."
git remote add origin "https://github.com/IGC-Hub/$REPO_NAME.git"

# Renommer la branche en main
echo "🌿 Configuration de la branche main..."
git branch -M main

# Afficher les instructions pour pousser
echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📤 Pour pousser le code sur GitHub, exécutez:"
echo "   git push -u origin main"
echo ""
echo "⚠️  Assurez-vous d'avoir créé le repository sur GitHub:"
echo "   https://github.com/organizations/IGC-Hub/repositories/new"
echo ""
echo "📚 Repository qui sera utilisé:"
echo "   https://github.com/IGC-Hub/$REPO_NAME"
echo ""
echo "🎉 Prêt à être poussé!"
