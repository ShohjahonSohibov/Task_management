"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Load environment variables
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const validate_token_1 = __importDefault(require("../middleware/validate-token"));
const db_1 = __importDefault(require("../config/db"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("../routes/taskRoutes"));
(0, db_1.default)();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.json({ limit: '4mb' }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
//root route
app.get('/', (req, res) => {
    res.send('App works properly!');
});
// Route definitions
app.use('/api/v1/auth/', authRoutes_1.default);
app.use('/api/v1/task/', validate_token_1.default, taskRoutes_1.default);
// Error handler middleware
app.use((err, req, res, next) => {
    if (res.headersSent)
        return next(err);
    res.status(400).json({ message: err.message });
});
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
//# sourceMappingURL=index.js.map