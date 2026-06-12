export default function UserAvatar({ name }) {
  const initial = (name?.trim()?.[0] || '?').toUpperCase();
  return (
    <span className="user-avatar" title={name} aria-hidden="true">
      {initial}
    </span>
  );
}
