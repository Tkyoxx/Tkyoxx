<div align="center">

<img src="assets/hero.svg" width="100%" alt="Tkyo_0x — Full-stack developer · SaaS de punta a punta para LATAM" />

<img src="assets/radio.svg" width="100%" alt="Team radio" />

</div>

<br/>

**Hola, soy Tkyo.** Desarrollador full-stack de Cúcuta, Colombia, y autodidacta de principio a fin: aprendí con tutoriales, documentación y muchas horas de prueba y error.

Hoy construyo productos completos en solitario (base de datos, backend, interfaz y despliegue) y los llevo hasta producción. De la F1 me quedo con la mentalidad: iterar rápido, cuidar cada décima y no parar hasta cruzar la meta.

<br/>

<p align="center">
  <img src="assets/driver.svg" width="49%" alt="Ficha del piloto" />
  <img src="assets/rules.svg" width="49%" alt="Cómo manejo" />
</p>

<img src="assets/season.svg" width="100%" alt="Temporada: mi camino" />

<img src="assets/stack.svg" width="100%" alt="Stack: compuestos de neumáticos" />

<img src="assets/featured.svg" width="100%" alt="P1 — SaaS de gestión operativa" />

<p align="center">
  <a href="https://github.com/Tkyoxx/plagasync-app-releases"><img src="assets/plagasync.svg" width="49%" alt="P2 — PlagaSync" /></a>
  <a href="https://github.com/Tkyoxx/nova.mp"><img src="assets/nova.svg" width="49%" alt="P3 — Nova.mp" /></a>
</p>

<img src="https://raw.githubusercontent.com/Tkyoxx/Tkyoxx/output/telemetry.svg" width="100%" alt="Telemetría en vivo" />

<img src="https://raw.githubusercontent.com/Tkyoxx/Tkyoxx/output/snake.svg" width="100%" alt="Contribuciones" />

<br/>

<img src="https://raw.githubusercontent.com/Tkyoxx/Tkyoxx/output/grid.svg" width="100%" alt="Parrilla de visitantes" />

<p align="center">
  <a href="https://github.com/Tkyoxx/Tkyoxx/issues/new?title=%F0%9F%8F%81%20Entrar%20a%20la%20parrilla&body=Solo%20env%C3%ADa%20este%20issue%20y%20en%20un%20par%20de%20minutos%20aparecer%C3%A1s%20en%20la%20parrilla%20de%20salida.%20No%20hace%20falta%20escribir%20nada%20m%C3%A1s%20%F0%9F%8F%8E%EF%B8%8F"><img src="assets/cta-grid.svg" width="49%" alt="Toma tu lugar en la parrilla" /></a>
  <a href="https://discord.com/users/tkyo_0x"><img src="assets/cta-discord.svg" width="49%" alt="Escríbeme por Discord: tkyo_0x" /></a>
</p>

<details>
<summary><b>🔧 Cómo está hecho este perfil</b></summary>

<br/>

Nada aquí es una imagen de plantilla ni un widget de terceros. Cada panel es un SVG animado generado con código propio:

- **`scripts/`**: generador en Node.js sin dependencias. Mide el texto con las métricas reales de cada fuente, recorta las tipografías al mínimo y las incrusta en cada SVG para que se vean igual en cualquier navegador.
- **Animación pura**: CSS y SMIL. El semáforo, el auto que da vueltas al circuito, el team radio escribiéndose y las notas a mano funcionan dentro de un `<img>`, sin JavaScript.
- **Telemetría real**: una GitHub Action consulta la API GraphQL de GitHub cada 8 horas y redibuja las métricas, el lap chart y los sectores mensuales.
- **Parrilla de visitantes**: al abrir el issue, la Action te añade a la parrilla con tu avatar, te da la bienvenida y cierra el issue.

```bash
node scripts/build.mjs
node scripts/build.mjs --live dist
```

</details>

<img src="assets/footer.svg" width="100%" alt="GG · Ship it" />
