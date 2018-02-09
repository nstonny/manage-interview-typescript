/*
export public async authenticate(req: Request, res: Response, next: NextFunction){

}

try {
    const token = req.header("x-auth");
    const user = await User.findByToken(token);
    if (!user) {
        res.status(404);
        res.json({
            status: res.statusCode,
            err: "user not found"
        });
    } else {
        const status = res.statusCode;
        res.json({
            status,
            user
        });
    }
} catch (err) {
    res.status(401);
    res.json({
        status: res.statusCode,
        err
    });
}
*/