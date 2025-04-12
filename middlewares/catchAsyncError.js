export const catchAsyncError = fn => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);    //catch any error that occurs in the async function and pass it to the next middleware  //promise is used to handle asynchronous operations in JavaScript. It represents a value that may be available now, or in the future, or never. In this case, it is used to handle the asynchronous operation of the function fn.
    };
};