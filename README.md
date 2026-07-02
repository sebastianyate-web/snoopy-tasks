# Snoopy — Ecosistema de Marketing (SSOT)

Único lugar donde vive la información. Reemplaza las carpetas viejas duplicadas:
`Documents\marketing-ai`, `Alphatype\marketing`, `Alphatype-Design-System`, `Alphatype-Brand-Book` (todas **deprecadas**).

> Regla de oro: si un dato no está en Snoopy, no existe. Una sola versión por dato.

## Jerarquía: empresa → área → (sub-marca)

```
Snoopy/
├── CLAUDE.md          ← documento maestro (el cerebro de ruteo)
├── _inbox/            ← subes tu curaduría aquí, luego dices "procesa el inbox"
├── _migration/        ← registro de qué vino de qué carpeta vieja
├── _shared/           ← templates y SOPs reutilizables entre empresas
│
├── alphatype/         ← EMPRESA B2B (wholesale, bulk, feminized seeds, EU + US)
│   ├── 00_foundation/ ← ADN de marca compartido por las dos áreas
│   │   ├── identity/      (estrategia, posicionamiento, audiencia, KPIs)
│   │   ├── design-system/ (logos, color, tipografía, templates)
│   │   ├── voice/         (voz y mensajería B2B)
│   │   └── products/      (catálogo, genéticas, datos)
│   ├── marketing/     ← ÁREA activa (todo lo trabajado hasta hoy)
│   └── comercial/     ← ÁREA ventas (nueva, por definir)
│
└── breedtech/         ← EMPRESA B2C (holding de marcas retail propias)
    ├── 00_foundation/ ← identidad + voz B2C (distinta a Alphatype)
    └── brands/        ← una carpeta por marca retail
```

## Cómo se llena
1. Subes tu curaduría a `_inbox/` (formato en `_inbox/LEEME.md`).
2. Dices "procesa el inbox" → Claude clasifica en la capa correcta y anota origen en `_migration/`.
3. Cuando todo esté migrado y verificado, se borran las carpetas viejas.

## Agentes
El equipo de agentes está definido en `CLAUDE.md`. Se construye por **actividad real**, empezando por Alphatype Marketing.
