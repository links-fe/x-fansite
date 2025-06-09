import { Icon } from '@x-vision/icons'
import { PrivacyEnum } from './enum'
import Privacy from '../Privacy'
import { PAGE_NAMES } from './page-names'

export const MORE_ITEMS = [
  {
    label: 'My profile',
    to: '/more/profile',
    icon: <Icon icon="x:UserCircleStyleStroke" />,
  },
  {
    label: 'Settings',
    to: '/more/setting',
    icon: <Icon icon="x:Settings01StyleStroke" />,
  },
]

export const SETTING_ITEMS = [
  {
    group: true,
    label: 'Preferences',
    children: [
      { label: PAGE_NAMES.ACCOUNT, icon: <Icon icon="x:UserAccountStyleStroke" /> },
      { label: PAGE_NAMES.PRIVACY, icon: <Icon icon="x:Key01StyleStroke" /> }, // to: '/more/setting/privacy',
      { label: PAGE_NAMES.NOTIFICATIONS, icon: <Icon icon="x:Notification01StyleStroke" /> }, //  to: '/more/setting/notifications',
      // { label: 'Payments', to: '/more/setting', icon: <Icon icon="x:CreditCardStyleStroke" /> },
      { label: PAGE_NAMES.DELETE_ACCOUNT, icon: <Icon icon="x:Delete01StyleStroke" /> },
    ],
  },
  {
    group: false,
    label: 'Info and support',
    children: [
      { label: PAGE_NAMES.HELP, to: '/more/setting/help-center', icon: <Icon icon="x:HelpCircleStyleStroke" /> },
      { label: PAGE_NAMES.ABOUT, to: '/more/setting/about', icon: <Icon icon="x:InformationCircleStyleStroke" /> },
    ],
  },
]

export const ABOUT_ITEMS = [
  { label: 'Terms & safety', to: '/more/setting/about/detail?type=Terms' },
  { label: 'DMCA take down', to: '/more/setting/about/detail?type=DMCA' },
  { label: 'Cookies', to: '/more/setting/about/detail?type=Cookies' },
]

export const HELP_ITEMS = [
  { label: 'For all users FAQ', to: '/more/setting/help-center/faq?type=users', extra: 'Public' },
  { label: 'For fans FAQ', to: '/more/setting/help-center/faq?type=fans', extra: 'Public' },
  { label: 'For creators FAQ', to: '/more/setting/help-center/faq?type=creators', extra: 'Public' },
  { label: 'Feedback', to: '/more/setting/help-center/feedback', extra: 'Public' },
]

export const HELP_FAQ_ITEMS = [
  { label: 'Question', to: '/more/setting/help-center/faq-detail?type=users&id=xxx' },
  {
    label: 'If a sentence has a long name, it will wrap to the next line',
    to: '/more/setting/help-center/faq-detail?type=users&id=xxx',
  },
  { label: 'Question', to: '/more/setting/help-center/faq-detail?type=users&id=xxx' },
  { label: 'Question', to: '/more/setting/help-center/faq-detail?type=users&id=xxx' },
]

export const NOTIFICATIONS_ITEMS = [
  // { label: 'Push notifications', to: '/more/setting/notifications/push' },
  { label: PAGE_NAMES.NOTIFICATION_PUSH },
  // { label: 'Email notifications', to: '/more/setting/notifications/email' },
  { label: PAGE_NAMES.NOTIFICATION_EMAIL },
]

export const PRIVACY_ITEMS = [
  { label: 'Public', value: PrivacyEnum.Public },
  { label: 'Only followers', value: PrivacyEnum.Follower },
  { label: 'Only myself', value: PrivacyEnum.Myself },
]
