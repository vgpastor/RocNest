---
title: "Excel para gestionar el material de un club: hasta dónde llega y cuándo se rompe"
description: "Una hoja de cálculo es suficiente para muchos clubes. Estos son los cuatro puntos concretos donde deja de serlo, y cómo saber si ya los has cruzado."
date: "2026-02-05"
author: "Víctor García Pastor"
category: "management"
tags: ["excel", "herramientas", "organización"]
translationKey: "excel-limits"
draft: false
---

Voy a decir algo que no me conviene comercialmente: **para muchos clubes, Excel está bien**.

Si tienes treinta piezas de material, cinco personas que lo cogen y todo el mundo se conoce, una hoja de cálculo compartida resuelve el problema. Montar un sistema encima de eso es complicarse la vida.

Ahora bien, hay cuatro puntos donde Excel deja de funcionar. No es cuestión de tamaño, sino de qué necesitas que el sistema haga.

## 1. Cuando necesitas saber quién tenía qué, y cuándo

Una hoja de cálculo guarda **estado**, no **historia**. La celda dice "prestado a Marta" y cuando Marta devuelve, alguien la cambia a "disponible". La información de que Marta lo tuvo del 3 al 17 de marzo desaparece en el momento en que se sobrescribe.

Eso da igual hasta el día que importa: una cuerda con una caída fuerte no reportada, una queja, un seguro que pregunta. Ese día, el historial es la única respuesta posible, y no lo tienes.

Puedes simularlo con una hoja de movimientos donde solo se añaden filas y nunca se editan. Funciona, pero exige una disciplina que en la práctica nadie mantiene seis meses.

## 2. Cuando dos personas tocan la hoja a la vez

Con Excel en la nube esto se disimula, pero no desaparece: dos personas mirando disponibilidad al mismo tiempo pueden prometer la misma cuerda a dos grupos distintos. La hoja no sabe decir "esto ya está reservado", solo muestra lo que había cuando la abriste.

En un club donde las salidas se organizan el jueves por la noche para el sábado, esto pasa más de lo que parece.

## 3. Cuando los avisos dependen de que alguien se acuerde

Una revisión anual que vence en octubre no se avisa sola en una hoja de cálculo. Puedes poner formato condicional que ponga la fila en rojo, pero alguien tiene que **abrir el archivo** para verlo.

El material caducado no se detecta porque nadie mire la hoja: se detecta cuando alguien va a usarlo. Que es tarde.

## 4. Cuando quien lo lleva todo se va

Este es el punto real, y no tiene que ver con la tecnología. La hoja de cálculo suele venir acompañada de una persona que sabe interpretarla: qué significa esa columna, por qué esas filas están en gris, cuál es la versión buena del archivo.

El día que esa persona deja el cargo, el club hereda un fichero que nadie entiende del todo. He visto clubes rehacer el inventario entero por esto.

## Cómo saber si ya has cruzado la línea

Preguntas concretas. Si respondes que no a dos o más, Excel ya se te ha quedado corto:

- ¿Puedes saber quién tuvo una pieza concreta hace tres meses?
- ¿El sistema impide prestar algo que ya está reservado?
- ¿Te avisa alguien que no seas tú de que una revisión vence?
- ¿Podría otra persona coger el relevo mañana sin que le expliques nada?
- ¿Sabes, sin abrir nada, cuánto material tienes retirado?

## Si aún no la has cruzado

Entonces quédate con Excel, pero hazlo bien: identificador único por pieza, una pestaña de movimientos donde solo se añaden filas, copia de seguridad automática y al menos dos personas que sepan usarlo.

Y si la has cruzado, la alternativa no tiene por qué costar dinero. [RocNest](/es) hace exactamente estas cuatro cosas —historial, disponibilidad real, avisos y acceso compartido por roles— y es gratuito y de código abierto.

Lo importante es que el cambio lo decidas por un motivo concreto de esta lista, y no porque alguien te diga que Excel es poco profesional. Para muchos clubes, no lo es.
