import TopBar from './components/TopNavBar'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body>
                <TopBar />
                <main>{children}</main>
            </body>
        </html>
    )
}