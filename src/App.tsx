import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import './App.css'

interface DividerProps {
	scope: React.RefObject<HTMLDivElement | null>;
}

interface TimeNumberProps {
	id: number;
	scope: React.RefObject<HTMLDivElement | null>;
}

interface MainTimeProps {
	scope: React.RefObject<HTMLDivElement | null>;
}

const style = window.getComputedStyle(document.body);

const Divider: React.FC<DividerProps> = (props) => {
	const colon = useRef<SVGPathElement>(null);
	
	useGSAP(() => {
		if (colon.current) {
			gsap.to(colon.current, {
				opacity: 0,
				repeat: -1,
				yoyo: true,
				duration: 0.5,
				ease: 'none'
			});
		}
	}, { scope: props.scope });
	
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="360" viewBox="0 0 800 800" className="dividerSVG">
			<defs>
				<linearGradient
					id="a"
					x1={400}
					y1={0}
					x2={400}
					y2={800}
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor={style.getPropertyValue('--grad')} /> 
					<stop offset={0.5} stopColor="#fff" stopOpacity={0} />      
					<stop offset={1} stopColor={style.getPropertyValue('--grad')} />
				</linearGradient>
			</defs>	
			<path 
				ref={colon} 
				d="M555.56,800H244.44v-311.11h311.11v311.11ZM555.56,311.11H244.44S244.44,0,244.44,0h311.11v311.11Z" 
				fill={style.getPropertyValue('--grad')} 
				opacity={0.5}
			/>
		</svg>
	);
}

const TimeNumber: React.FC<TimeNumberProps> = (props) => {
	const [time, setTime] = useState(new Date());
	const barPath1 = useRef<SVGPathElement>(null);
	const barPath2 = useRef<SVGPathElement>(null);
	
	const pathArr = [
		{path1: "M640 400H150V160h490v240z", path2: "M640 640H150V400h490v240z"},
		{path2: "M320 640H0V160h320v480z", path1: "M800 640H480V0h320v640z"},
		{path1: "M640 320H0V160h640v160z", path2: "M800 640H160V480h640v160z"},
		{path1: "M640 320H0V160h640v160z", path2: "M640 640H0V480h640v160z"},
		{path1: "M640 320H160V0h480v320z", path2: "M640 800H0V480h640v320z"},
		{path1: "M800 320H160V160h640v160z", path2: "M640 640H0V480h640v160z"},
		{path1: "M800 320H160V160h640v160z", path2: "M640 640H160V480h480v160z"},
		{path1: "M640 480H0V160h640v320z", path2: "M640 800H0V480h640v320z"},
		{path1: "M640 320H160V160h480v160z", path2: "M640 640H160V480h480v160z"},
		{path1: "M640 320H160V160h480v160z", path2: "M640 640H0V480h640v160z"}		
	];
	
	useGSAP(() => {
		gsap.delayedCall(1, () => setTime(new Date()));
		
		const h1 = time.getHours().toString().length < 2 ? 0 : time.getHours().toString()[0];
		const h2 = time.getHours().toString().length < 2 ? time.getHours() : time.getHours().toString()[1];
		const m1 = time.getMinutes().toString().length < 2 ? 0 : time.getMinutes().toString()[0];
		const m2 = time.getMinutes().toString().length < 2 ? time.getMinutes() : time.getMinutes().toString()[1];
		
		const timeNow = `${h1}${h2}${m1}${m2}`;
		const index = parseInt(timeNow[props.id]);
		const target1 = pathArr[index].path1;
		const target2 = pathArr[index].path2;

		if (barPath1.current && barPath2.current) {
			gsap.to(barPath1.current, {
				attr: { d: target1 },
				delay: props.id * 0.1,
				duration: 1,
				ease: 'expo.inOut'
			});
			
			gsap.to(barPath2.current, {
				attr: { d: target2 },
				delay: props.id * 0.1,
				duration: 1,
				ease: 'expo.inOut'
			});
		}
	}, { dependencies: [time], scope: props.scope });

	return (
		<svg className="mainSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
			<defs>
				<linearGradient
					id="a"
					x1={400}
					y1={0}
					x2={400}
					y2={800}
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor={style.getPropertyValue('--grad')} /> 
					<stop offset={0.5} stopColor="#fff" stopOpacity={0} />      
					<stop offset={1} stopColor={style.getPropertyValue('--grad')} />
				</linearGradient>
			</defs>
			<path d="M800 800H0V0h800v800z" fill={style.getPropertyValue('--grad')} />
			<path d="M800 800H0V0h800v800z" fill="url(#a)" />		 
			<path ref={barPath1} d="M800 800H0V0h800v800z" fill={style.getPropertyValue('--bg')} />  
			<path ref={barPath2} d="M800 800H0V0h800v800z" fill={style.getPropertyValue('--bg')} />  
			<path d="M800 800H0V0h800v800z" fill="transparent" stroke={style.getPropertyValue('--bg')} strokeWidth="42" />
		</svg>
	);
}

const MainTime: React.FC<MainTimeProps> = (props) => {
	const list = [];
	for (let i = 0; i < 4; i++) {
		if (i === 2) {
			list.push(<Divider key="divider" {...props} />);
		}
		list.push(<TimeNumber id={i} key={i} {...props} />);
	}
	return <>{list}</>;
}

export default function App() {
	const container = useRef<HTMLDivElement>(null);

	return (
		<div className="App">
			<div className="container" ref={container}>
				<MainTime scope={container} />
			</div>
		</div>
	);
}

const rootElement = document.getElementById("root");
if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<App />);
}
