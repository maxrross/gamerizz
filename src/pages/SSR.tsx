// pages/profile.js
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Profile({ user }) {
  return <div>Hello {user.name} SSR</div>;
}

// You can optionally pass your own `getServerSideProps` function into
// `withPageAuthRequired` and the props will be merged with the `user` prop
export const getServerSideProps = withPageAuthRequired();