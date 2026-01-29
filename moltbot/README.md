# ReCole WhatsApp Bot (Moltbot)

Bot de WhatsApp para grupos de apoderados que busca productos en ReCole y sugiere publicar.

## Requisitos

- Node.js >= 22
- Cuenta de WhatsApp dedicada para el bot
- API key de Anthropic (Claude)

## Instalación

```bash
# Instalar Moltbot globalmente
npm install -g moltbot@latest

# Ejecutar el asistente de configuración
moltbot onboard --install-daemon
```

## Configuración

1. Copiar configuración de ejemplo:

```bash
cp moltbot.example.json ~/.clawdbot/moltbot.json
```

2. Copiar skill de ReCole:

```bash
cp -r skills/recole ~/.clawdbot/skills/
```

3. Configurar grupos permitidos en `moltbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "groupAllowFrom": [
        "120363xxxxx@g.us"
      ]
    }
  }
}
```

4. Escanear código QR de WhatsApp:

```bash
moltbot pair whatsapp
```

## Uso

El bot escucha automáticamente los grupos configurados y:

- **Responde búsquedas**: "busco uniforme talla 8" → muestra resultados de ReCole
- **Invita a publicar**: "vendo buzo del colegio" → invita a publicar en ReCole

### Comandos de administración

En chat privado con el bot:

- `/status` - Ver estado del bot
- `/activation mention` - Solo responder cuando lo mencionan
- `/activation always` - Responder a todos los mensajes relevantes

## API

El bot usa el endpoint `/api/bot/search` de ReCole:

```bash
GET /api/bot/search?q=uniforme&school=san+jose&limit=5
```

## Desarrollo

Para probar localmente:

```bash
cd moltbot
moltbot gateway:watch
```

## Producción

El daemon se instala automáticamente con `--install-daemon`. Para reiniciar:

```bash
moltbot restart
```
