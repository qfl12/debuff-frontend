/**
 * 验证图片文件格式和大小
 * @param {File} file - 待验证的文件对象
 * @param {Object} options - 验证选项
 * @param {number} [options.maxSize=5] - 最大文件大小(MB)
 * @param {string[]} [options.allowedTypes=['image/jpeg', 'image/png']] - 允许的MIME类型
 * @returns {Object} 验证结果
 * @returns {boolean} valid - 是否验证通过
 * @returns {string} message - 验证失败时的错误消息
 */
export const validateImageFile = (file, options = {}) => {
  const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png'] } = options;

  // 验证文件类型
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `不支持的文件格式，仅允许: ${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`
    };
  }

  // 验证文件大小
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return {
      valid: false,
      message: `文件大小不能超过 ${maxSize}MB`
    };
  }

  return { valid: true, message: '' };
};