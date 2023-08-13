# Kenshi UI

<div style="margin: 0 auto 2rem; text-align: center; white-space: pre-wrap;">
Imagine managing inventory to the sound of a dark ambient music, while watching
the day turns into night and vice versa, and so on, right in your browser.
Well, that's what it's all about.
</div>

![](docs/social-preview.png?raw=true)

<div style="text-align: center;"><a href="https://valooford.github.io/kenshi-ui/">View Demo »</a></div>

## About

This application carefully interprets all the above mentioned experience you might have when playing the [Kenshi](https://store.steampowered.com/app/233860/Kenshi/) game.

Here's the list of core _Kenshi UI_ **features**:

- Complete day/night cycle and time speed control.
- Registry of items with properties taken from the game (thanks to [OCS](https://github.com/lmaydev/OpenConstructionSetOld)).
- All the inventory management related logic including dragging with a mouse (or any other pointing device), item stacks, automatic arrangement, continuous (re)placement, fast distributive moving, targeting of type-specific regions, cross-character moving and more and more.
- GUI sounds and music system that imitates the [original one](https://www.youtube.com/watch?v=wPEJRJWHz4k).
- Flexible layout that looks relatively well on small screens.
- Minimalist styling taken from the [Dark UI](https://steamcommunity.com/sharedfiles/filedetails/?id=1200632417) mod.
- Minor improvements affecting user experience.

## Code

[![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)

The code is organised into layers of data and interface, which makes it easy to reason about.

Also there is a tool called **Kenshi UI Items Loader** that allows to get/update the items data right from the installed copy of a game. It utilizes the [Open Construction Set](https://github.com/lmaydev/OpenConstructionSetOld) (OCS) modding SDK.

## Thanks

This application would not be possible without:

- [Lo-Fi Games](https://lofigames.com/), developers of _Kenshi_
- [Kole Hicks](https://www.youtube.com/@KoleMusician), composer/sound designer of _Kenshi_
- [lmaydev](https://github.com/lmaydev), the creator of an amazing _Open Construction Set_ modding tool
- [Eldryn](https://steamcommunity.com/id/Eldryn), the creator of _Dark UI_ mod
- [Kenshi Wiki](https://kenshi.fandom.com/) contributors and maintainers

---

@ All rights belong to their respective owners
