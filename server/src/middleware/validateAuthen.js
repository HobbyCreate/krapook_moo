export const zodValidation = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
    } catch(error) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
}