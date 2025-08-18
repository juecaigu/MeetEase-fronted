import { TOKEN_KEY } from '../config/constant'
import { redirect } from 'react-router-dom'

export function protectedLoader() {
  //没有登录，跳转到登录页
  if (!localStorage.getItem(TOKEN_KEY)) {
    return redirect('/login')
  }
  return null
}
