export function LoadingRecords({ detail = false }: { detail?: boolean }) {
  return (
    <div
      className={"records-loading" + (detail ? " records-loading-detail" : "")}
      role="status"
      aria-label="접수를 불러오는 중"
      aria-busy="true"
    >
      <span>접수 기록을 가져오고 있습니다.</span>
      <div aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="records-loading-row" key={i}>
            <i />
            <div>
              <b />
              <b />
            </div>
            <em />
          </div>
        ))}
      </div>
    </div>
  );
}
