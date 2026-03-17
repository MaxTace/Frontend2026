export const config = {
    ACCESS_SECRET: "mysupersecretjwtkey" as const,
    ACCESS_EXPIRES_IN: "10s" as const,

    ACCESS_REFRESH_SECRET: "mysupersecretjwtrefresh" as const,
    ACCESS_REFRESH_EXPIRES_IN: "7d" as const,
};
