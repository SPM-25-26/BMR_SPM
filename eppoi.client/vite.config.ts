import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';
import { VitePWA } from 'vite-plugin-pwa'

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "eppoi.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7039';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        plugin(),
        mockDevServerPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['vite.svg', 'react.svg', 'assets/*'],
            manifest: {
                name: 'Eppoi App',
                short_name: 'Eppoi',
                description: 'Il tuo assistente turistico',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 anno
                            }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'lucide-react@0.487.0': 'lucide-react',
            'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png': path.resolve(__dirname, './src/assets/958defa264c22f47e7a42e2e88ba5be34b61d176.png'),

            'vaul@1.1.2': 'vaul',
            'sonner@2.0.3': 'sonner',
            'recharts@2.15.2': 'recharts',
            'react-resizable-panels@2.1.7': 'react-resizable-panels',
            'react-hook-form@7.55.0': 'react-hook-form',
            'react-day-picker@8.10.1': 'react-day-picker',
            'next-themes@0.4.6': 'next-themes',
            'input-otp@1.4.2': 'input-otp',
            'embla-carousel-react@8.6.0': 'embla-carousel-react',
            'cmdk@1.1.1': 'cmdk',
            'class-variance-authority@0.7.1': 'class-variance-authority',
            '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
            '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
            '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
            '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
            '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
            '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
            '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
            '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
            '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
            '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
            '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
            '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
            '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
            '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
            '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
            '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
            '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
            '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
            '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
            '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
            '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
            '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
            '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        }
    },
    server: {
        proxy: {
            '^/api/auth': {
                target,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '51720'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
