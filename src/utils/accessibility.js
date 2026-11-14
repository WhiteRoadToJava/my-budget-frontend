/**
 * يستخدم مع onKeyDown على أي عنصر تفاعلي (div) بدور زر بس مش <button> حقيقي،
 * عشان يشتغل بمفتاح Enter أو Space زي أي زر عادي بلوحة المفاتيح.
 *
 * مثال:
 *   <div role="button" tabIndex={0} onClick={handleClick} onKeyDown={onEnterOrSpace(handleClick)}>
 */
export const onEnterOrSpace = (handler) => (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handler(event);
  }
};
