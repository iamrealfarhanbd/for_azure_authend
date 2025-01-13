BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [needPasswordChange] BIT NOT NULL CONSTRAINT [users_needPasswordChange_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [users_status_df] DEFAULT 'PENDING',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [verificationInfo] NVARCHAR(1000),
    [userType] NVARCHAR(1000) NOT NULL CONSTRAINT [users_userType_df] DEFAULT 'VIEWER',
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[user_profile] (
    [id] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [age] INT,
    [gender] NVARCHAR(1000),
    [pronoun] NVARCHAR(1000),
    [profilePhoto] NVARCHAR(1000),
    [contactNumber] NVARCHAR(1000) NOT NULL,
    [bio] NVARCHAR(1000),
    [isDeleted] BIT NOT NULL CONSTRAINT [user_profile_isDeleted_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_profile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [preferredContent] NVARCHAR(1000),
    CONSTRAINT [user_profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_profile_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [user_profile_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[user_profile] ADD CONSTRAINT [user_profile_email_fkey] FOREIGN KEY ([email]) REFERENCES [dbo].[users]([email]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
