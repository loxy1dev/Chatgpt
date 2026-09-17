import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'ChatGPT GitHub Agent',description:'AI coding workspace connected to GitHub'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
