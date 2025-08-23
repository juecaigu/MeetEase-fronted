import type { Rule } from 'antd/es/form'

const RULES = {
  username: [
    { required: true, message: '请输入用户名' },
    {
      pattern: /^[a-zA-Z0-9_-]{3,50}$/,
      message: '用户名只能包含字母、数字、下划线和连字符,长度在3-50个字符之间',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
    },
  ],
  nickname: [
    { required: true, message: '请输入昵称' },
    { min: 2, max: 50, message: '昵称长度必须在2-50个字符之间' },
  ],
  password: [
    { required: true, message: '' },
    { min: 8, max: 50, message: '密码长度必须在8-50个字符之间' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
    },
  ],
}

export default RULES as Record<keyof typeof RULES, Rule[]>
