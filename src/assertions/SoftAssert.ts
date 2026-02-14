export class SoftAssert {

  private errors:string[] = [];

  assert(condition:boolean, message:string){
    if(!condition) this.errors.push(message);
  }

  assertAll(){
    if(this.errors.length){
      throw new Error(this.errors.join('\n'));
    }
  }
}