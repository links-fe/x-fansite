export const DEFAULT_IMG_MIME_TYPE = 'image/png'

export const DEFAULT_IMG_ACCEPT = 'image/jpeg,image/png,image/gif'

/** 头像尺寸 */
export const AVATAR_SIZE = [300, 300]
/** 封面图尺寸 */
export const BACKGROUND_SIZE = [1600, 900]

// 支持字母、数字、下划线, 必须包含至少3个字符，最长为20个字符
export const NAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
