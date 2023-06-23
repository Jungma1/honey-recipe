import { SVGProps } from 'react';

function KakaoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="24" cy="24" r="24" fill="#FFE812" />
      <path
        d="M24 13C17.3725 13 12 17.3992 12 22.8258C12 26.3342 14.2461 29.4127 17.6248 31.1511C17.441 31.8094 16.4436 35.3862 16.4039 35.6672C16.4039 35.6672 16.38 35.8783 16.5117 35.9589C16.6433 36.0394 16.7982 35.9768 16.7982 35.9768C17.1757 35.9221 21.1762 33.0038 21.8686 32.4971C22.5603 32.5988 23.2726 32.6516 24 32.6516C30.6275 32.6516 36 28.2526 36 22.8258C36 17.3992 30.6275 13 24 13Z"
        fill="black"
      />
    </svg>
  );
}

export default KakaoIcon;
