import {Component} from 'angular2/core';
import {PuzzleComponent} from './puzzle/puzzle.component';
@Component({
    selector: 'app',
    template: `
        <h1 class="text-center">Magic Puzzle</h1>
        <ng2-puzzle></ng2-puzzle>
    `,
    directives: [PuzzleComponent] 
})

export class AppComponent {

}