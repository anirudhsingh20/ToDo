import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { todoListItem } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  db: any;
  public _todoList: BehaviorSubject<todoListItem[]> = new BehaviorSubject<todoListItem[]>([]);

  todoList(): Observable<todoListItem[]> {
    return this._todoList.asObservable();
  }

  constructor() {
    this.db = (<any>window).openDatabase('todoDB', '', 'my first database', 2 * 1024 * 1024);
    this.db.transaction(function (tx: any) {
      // tx.executeSql('Drop TABLE Todo');
      tx.executeSql('CREATE TABLE IF NOT EXISTS Todo (id integer primary key autoincrement, todoText)');
      // tx.executeSql('INSERT INTO Todo (todoText) VALUES ("Task 1")');
    });

    this.getAllTodosFromDb();

  }

  getAllTodosFromDb(){
    const _this = this;
    let list :todoListItem[] = []
    this.db.transaction(function (tx: any) {
      tx.executeSql('SELECT * FROM Todo', [], function (tx: any, results: any) {
        var len = results.rows.length, i;
        if(len > 0){
          list = [...results.rows];
        }
        _this.updateTodos(list)
      },null);
    });
  }

  addTodoInDb(todoItem: todoListItem){
    this.db.transaction(function (tx: any) {
      tx.executeSql(`INSERT INTO Todo (todoText) VALUES ("${todoItem.todoText}")`);
    });
  }
  removeTodoInDb(todoItem:todoListItem){
    this.db.transaction(function (tx: any) {
      tx.executeSql(`DELETE FROM Todo where id = ${todoItem.id}`);
    });
  }

  updateTodoInDb(todoItem:todoListItem){
    console.log(todoItem);

    this.db.transaction(function (tx: any) {
      tx.executeSql(`update Todo SET todoText =? where id =?`,[todoItem.todoText,todoItem.id]);
    });
  }

  updateTodos(todoItems:todoListItem[]){
    this._todoList.next(todoItems);
  }

  addTodo(todoItem: todoListItem) {
    this.addTodoInDb(todoItem);
    this.getAllTodosFromDb();
    // let list: todoListItem[] = this._todoList.getValue();
    // list.push(todoItem)
    // this._todoList.next(list);
  }

  removeTodo(todoItem: todoListItem) {
    this.removeTodoInDb(todoItem);
    this.getAllTodosFromDb();

    // let list: todoListItem[] = this._todoList.getValue();
    // list = list.filter(item => item !== todoItem)
    // this._todoList.next(list);
  }

  updateTodo(todoItem: todoListItem) {
    this.updateTodoInDb(todoItem);
    this.getAllTodosFromDb();
    // let list: todoListItem[] = this._todoList.getValue();
    // list = list.map(item => {
    //   if (item === todoItem) {
    //     return updatedTodoItem;
    //   }
    //   return item
    // })
    // this._todoList.next(list);
  }



}
