---
title: "Cómo montar el inventario de material de un club desde cero"
description: "El orden concreto para inventariar el material de un club: identificar cada pieza, decidir qué campos registrar y evitar los errores que obligan a empezar otra vez."
date: "2026-09-11"
author: "Víctor García Pastor"
category: "management"
tags: ["inventario", "organización", "material"]
translationKey: "inventory-from-scratch"
draft: false
---

Casi todos los inventarios de club que he visto se abandonan por el mismo motivo: se empezó por la hoja de cálculo en vez de por el almacén. Se montan veinte columnas preciosas, se rellenan cuarenta filas, y a los tres meses nadie sabe si la cuerda que tiene en la mano es la fila 12 o la 31.

El orden correcto es el inverso.

## Paso 1: que cada pieza se pueda distinguir

Antes de registrar nada, tienes que poder mirar una pieza y saber cuál es. Si tienes seis cuerdas iguales de 60 metros, sin identificador físico no tienes inventario: tienes un recuento.

Opciones que funcionan:

- **Termorretráctil numerado** en los extremos de cuerdas y cintas. Barato, resistente y no interfiere con el uso.
- **Marcado textil** con rotulador específico para material textil — nunca disolventes ni rotuladores industriales, que pueden degradar las fibras.
- **Grabado o pegatina** en material metálico y cascos.

El código debe ser **corto y único**: `C-014`, no `Cuerda Beal 60m azul comprada 2024`. La descripción va en el registro; en la pieza va el identificador.

Si el club tiene secciones, prefija por sección: `ESC-C-014`, `BAR-N-007`. Te ahorrará reorganizaciones después.

## Paso 2: decide qué vas a registrar, y nada más

La tentación es registrarlo todo. Resístela: cada campo que añades es un campo que alguien tiene que rellenar cada vez, y los inventarios mueren de fricción.

El mínimo que de verdad se usa:

| Campo | Para qué sirve |
|---|---|
| Identificador | Enlaza la pieza física con el registro |
| Tipo y modelo | Determina qué instrucciones de fabricante aplican |
| Fecha de fabricación | Punto de partida de la vida útil |
| Fecha de puesta en servicio | El reloj real empieza aquí |
| Estado | Disponible, prestado, en revisión, retirado |
| Ubicación | Dónde está cuando no está prestado |

Todo lo demás —color, precio, proveedor— es opcional y puede esperar.

## Paso 3: inventaría por lotes, no por perfección

No intentes hacerlo todo un sábado. Coge una categoría, por ejemplo cuerdas, y termínala entera: identificar, registrar, guardar. Luego arneses. Luego cascos.

Una categoría terminada vale más que cinco a medias, porque ya puedes empezar a usar el sistema para esa categoría mientras completas el resto.

## Paso 4: lo que no sepas, márcalo como desconocido

Te vas a encontrar material sin fecha de fabricación legible, sin etiqueta, o donado hace años sin papeles. La tentación es estimar. No lo hagas.

Registra **desconocido** de forma explícita, porque desconocido es un dato: significa que esa pieza no tiene trazabilidad y que, en material crítico, probablemente deba retirarse. Una fecha inventada convierte un problema visible en uno oculto.

## Los cuatro errores que obligan a empezar otra vez

**Identificadores que dependen del orden.** Si numeras 1, 2, 3 según el orden en que los sacas de la caja, el día que retires el 7 tendrás un hueco y alguien reutilizará el número. Usa códigos que no se reciclen nunca.

**Registrar la compra en vez de la puesta en servicio.** Material comprado en 2023 y estrenado en 2025 tiene dos fechas distintas, y la que cuenta para la vida útil no siempre es la que crees. Guarda ambas.

**Un único responsable.** Si solo una persona sabe usar el sistema, el inventario dura lo que dure esa persona en el cargo. Que al menos dos sepan hacerlo todo.

**No registrar las bajas.** Un inventario que solo crece miente. El material retirado tiene que constar como retirado, con fecha y motivo — y salir físicamente de circulación.

## Cuando el inventario ya vive

A partir de aquí lo que importa es que el registro se actualice solo, como efecto de lo que ya haces: al prestar, al devolver, al revisar. Si actualizar el inventario es una tarea aparte que alguien tiene que acordarse de hacer, volverás al Excel abandonado.

Eso es justamente lo que hace [RocNest](/es): el registro es consecuencia del préstamo y de la revisión, no un trabajo añadido. Es gratuito y de código abierto.

Pero incluso en papel, si consigues los cuatro pasos de arriba tienes un inventario de verdad. Lo demás es comodidad.
