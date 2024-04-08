import Footer from "./footer";



export default function LayoutFooter({ children }) {
	return (
		<>
		<main>{children}</main>
		<Footer />
		</>
	)
}