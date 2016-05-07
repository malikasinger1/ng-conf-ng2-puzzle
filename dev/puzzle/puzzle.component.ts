import { Component, OnInit } from 'angular2/core';

@Component({
    selector: 'ng2-puzzle',
    template: `
        
        <section class="name-section">
            Please enter your name : 
            <input type="text" #name (keyup)="0">               <!-- user will enter his name here. the variable used is "name" -->
        </section>
        <br>
        <section class="puzzle" [ngClass]="{ danger: !isSolved(el1,el2,el3,el4), success:isSolved(el1,el2,el3,el4) }" [ngStyle]=" { display : name.value!='' ? 'block' : 'none' }">
        
            <h4>Welcome {{name.value}} !</h4>
            <h4>THE PUZZLE IS : {{isSolved(el1,el2,el3,el4) ? 'Solved' : 'Not Solved'}}</h4>
            
            Val1: <input type="text" value="-1" #el1 (keyup)="0">
            <br>
            Val2: <input type="text" value="-1" #el2 (keyup)="0">
            <br>
            Val3: <input type="text" value="-1" #el3 (keyup)="0">
            <br>
            Val4: <input type="text" value="-1" #el4 (keyup)="0">
            <br>
            
        </section>
        
        <h2 *ngIf="isSolved(el1,el2,el3,el4)">Congrats {{name.value}}! You have solved the puzzle :) </h2>
    `
})
export class PuzzleComponent implements OnInit {
    constructor() { }
    
    //defining four number variables that will countain our puzzle input values
    num1: number;
    num2: number;
    num3: number;
    num4: number;
    ngOnInit() {
        
        // when the component is initiated, assign random numbers to the four number variables
        this.num1= Math.round(Math.random());
        this.num2= Math.round(Math.random());
        this.num3= Math.round(Math.random());
        this.num4= Math.round(Math.random()); 
        
        // log the numbers so we don't have to try all the combinations ;)
        console.log(this.num1);        
        console.log(this.num2);
        console.log(this.num3);
        console.log(this.num4);
    }
    
    isSolved(el1,el2,el3,el4){
        // the puzzle is solved only if all the element input values match their respective numbers (random numbers) here
        return (el1.value==this.num1 && el2.value==this.num2 && el3.value==this.num3 && el4.value==this.num4);
    }

}