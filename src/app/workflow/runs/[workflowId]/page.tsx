import Topbar from '../../_components/topbar/topbar';

export default function ExecutionPage() {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        title="All runs"
        subtitle="List of all your workflow runs"
        hideButtons
      />
    </div>
  );
}
