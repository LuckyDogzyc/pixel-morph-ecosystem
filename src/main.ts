import './style.css'
import { Game } from './game/Game'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = '<div id="game"></div>'

new Game()
