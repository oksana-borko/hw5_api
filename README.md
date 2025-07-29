- **src/service/UserServiceEmbeddedImpl.ts**
- Corrected import from `./index.ts` to direct imports from `UserService.ts` and `UserFilePersistenceService.ts`.

- **src/controllers/UserController.ts**
    - **updateUser**: Fixed undefined `body.id` in `catch` block by storing `userId` in `try` block.

- **src/server.ts**
    - Added `unhandledRejection` and `uncaughtException` handlers to log errors and ensure graceful shutdown with data saving.