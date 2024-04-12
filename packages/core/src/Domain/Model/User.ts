import { DisplayName, UserId, Mail, Nominal } from "../ValueObject"

export type User = Nominal<{
  id: UserId
  email: Mail
  displayName: DisplayName
}, 'User'>