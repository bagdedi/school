# Configuration du Module de Messagerie

## Vue d'ensemble

Le module de messagerie permet d'envoyer des SMS, messages WhatsApp et Facebook Messenger aux étudiants et enseignants connectés à votre application.

## Fonctionnalités

- ✅ **Envoi de SMS** via API SMS (Twilio, Nexmo, etc.)
- ✅ **Messages WhatsApp Business** via l'API WhatsApp Business
- ✅ **Messages Facebook Messenger** via l'API Facebook Messenger
- ✅ **Sélection multiple des destinataires** (étudiants et enseignants)
- ✅ **Modèles de messages** avec variables dynamiques
- ✅ **Historique des messages** avec statuts de livraison
- ✅ **Statistiques et analytics** des envois
- ✅ **Interface moderne et responsive**

## Installation

1. **Installer les dépendances** (déjà fait)
```bash
npm install axios react-select @types/react-select
```

2. **Configuration des APIs**

### Configuration SMS (Twilio)

```bash
# Créez un compte sur https://www.twilio.com/
# Récupérez vos identifiants depuis la console Twilio

REACT_APP_SMS_API_KEY=your_twilio_account_sid
REACT_APP_SMS_API_SECRET=your_twilio_auth_token
```

### Configuration WhatsApp Business

```bash
# Configurez WhatsApp Business API via Facebook Business
# Documentation: https://developers.facebook.com/docs/whatsapp

REACT_APP_WHATSAPP_API_KEY=your_whatsapp_business_api_token
REACT_APP_WHATSAPP_API_SECRET=your_whatsapp_api_secret
```

### Configuration Facebook Messenger

```bash
# Créez une app Facebook et configurez Messenger
# Documentation: https://developers.facebook.com/docs/messenger-platform

REACT_APP_FACEBOOK_API_KEY=your_facebook_page_access_token
REACT_APP_FACEBOOK_API_SECRET=your_facebook_app_secret
```

## Structure des fichiers

```
components/messaging/
├── types.ts                 # Types TypeScript
├── MessagingService.ts      # Service principal
├── MessagingPage.tsx        # Page principale
├── ContactSelector.tsx      # Sélection des contacts
├── MessageComposer.tsx      # Composition des messages
├── MessageHistory.tsx       # Historique des messages
├── MessagingStats.tsx       # Statistiques
└── TemplatesPage.tsx        # Gestion des modèles

components/icons/
├── MessageIcon.tsx          # Icône de messagerie
├── HistoryIcon.tsx          # Icône d'historique
└── TemplateIcon.tsx         # Icône de modèles
```

## Navigation

Le module est accessible via la sidebar sous "Messagerie" avec 3 sous-sections :
- **Envoyer messages** : Interface principale d'envoi
- **Historique** : Consultation de l'historique des messages
- **Modèles** : Gestion des modèles de messages

## Utilisation

### 1. Envoi de messages

1. Sélectionnez les destinataires (étudiants/enseignants)
2. Choisissez le type de service (SMS/WhatsApp/Facebook)
3. Rédigez votre message ou utilisez un modèle
4. Cliquez sur "Envoyer"

### 2. Modèles de messages

Les modèles incluent des variables dynamiques :
- `{firstName}` : Prénom
- `{lastName}` : Nom de famille
- `{subject}` : Matière
- `{time}` : Heure
- `{date}` : Date
- `{phone}` : Numéro de téléphone
- `{amount}` : Montant
- `{term}` : Trimestre

### 3. Exemples de modèles pré-configurés

#### Rappel de cours
```
Bonjour {firstName}, n'oubliez pas votre cours de {subject} aujourd'hui à {time}.
```

#### Convocation parent
```
Madame/Monsieur {parentName}, nous vous prions de bien vouloir vous présenter à l'établissement le {date} à {time} concernant votre enfant {studentName}.
```

#### Paiement en attente
```
Bonjour {firstName}, nous vous rappelons que votre paiement de {amount} FCFA pour {term} est en attente. Date limite: {dueDate}.
```

## Intégration avec les APIs

### SMS avec Twilio

```typescript
const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
  To: phone,
  From: 'YOUR_TWILIO_PHONE_NUMBER',
  Body: message,
}, {
  auth: {
    username: apiKey,
    password: apiSecret,
  },
});
```

### WhatsApp Business API

```typescript
const response = await axios.post(`https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages`, {
  messaging_product: 'whatsapp',
  to: phone,
  text: { body: message },
}, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});
```

### Facebook Messenger API

```typescript
const response = await axios.post('https://graph.facebook.com/v18.0/me/messages', {
  recipient: { id: recipientId },
  message: { text: message },
}, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});
```

## Sécurité

- ✅ Variables d'environnement pour les clés API
- ✅ Validation des données avant envoi
- ✅ Gestion des erreurs et retry logic
- ✅ Logs des tentatives d'envoi

## Limitations actuelles

- Mode simulation activé par défaut (désactivez en production)
- Pas de programmation d'envois différés
- Pas de gestion des réponses automatiques
- Pas d'intégration avec un CRM externe

## Support

Pour toute question ou problème :
1. Vérifiez la configuration des variables d'environnement
2. Consultez les logs de la console pour les erreurs
3. Vérifiez que les numéros de téléphone sont au format international

## Développement futur

### Fonctionnalités prévues
- [ ] Programmation d'envois différés
- [ ] Réponses automatiques
- [ ] Intégration avec des CRM
- [ ] Analytics avancés
- [ ] Export des rapports
- [ ] Notifications push
- [ ] Chatbot intégré

### APIs supplémentaires
- [ ] Telegram
- [ ] Slack
- [ ] Microsoft Teams
- [ ] Email (SMTP)