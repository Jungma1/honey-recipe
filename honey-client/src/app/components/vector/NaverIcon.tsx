import { SVGProps } from 'react';

function NaverIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24Z"
        fill="#03C75A"
      />
      <path
        d="M27.1199 24.6171L20.6285 15.3143H15.2456V32.6857H20.8799V23.3828L27.3713 32.6857H32.7542V15.3143H27.1199V24.6171Z"
        fill="white"
      />
    </svg>
  );
}

export default NaverIcon;
