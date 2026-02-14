
export async function shadowLocator(page: any, host: string, selector: string){
  return page.locator(host).locator(`:shadow ${selector}`);
}