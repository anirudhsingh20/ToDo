import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-app';

  todoList: todoListItem[] = []

  todoForm: FormGroup = new FormGroup({
    todoText: new FormControl('', Validators.required)
  });

  isUpdateTodo: boolean = false;
  todoToUpdate: todoListItem | null = null;

  constructor(private todoService: TodoService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.todoService.todoList().subscribe(list => {
        this.todoList = list;
        this.cdr.detectChanges();
    })
  }

  onTodoAdd() {
    if (this.todoForm.valid) {
      console.log(this.todoForm.value);

      let newTodoItem: todoListItem = {
        todoText: this.todoForm.get('todoText')?.value
      }

      this.todoService.addTodo(newTodoItem);
      this.todoForm.reset();
    }
  }

  onTodoDelete(todoItem: todoListItem) {
    this.todoService.removeTodo(todoItem);
  }

  updateTodo(todoItem: todoListItem) {
    this.isUpdateTodo = true;
    this.todoToUpdate = todoItem;
    this.todoForm.patchValue({
      'todoText':this.todoToUpdate.todoText
    })
  }

  onUpdateTodo() {
    // console.log(this.isUpdateTodo, this.todoToUpdate, this.todoForm.valid);

    if (this.isUpdateTodo && this.todoToUpdate && this.todoForm.valid) {
      let todoItem: todoListItem = this.todoToUpdate;
      let newTodo: todoListItem = {
        todoText: this.todoForm.get('todoText')?.value,
        id:todoItem.id || null
      }
      this.todoService.updateTodo(newTodo);
      this.isUpdateTodo = false;
      this.todoToUpdate = null;
      this.todoForm.reset()
    }
  }

  onCancel(){
    this.todoToUpdate = null;
    this.isUpdateTodo = false;
    this.todoForm.reset();
  }

}

export interface todoListItem {
  todoText: string,
  id?:number | null
}
