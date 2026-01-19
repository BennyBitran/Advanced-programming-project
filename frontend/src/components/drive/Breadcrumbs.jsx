export default function Breadcrumbs({ title, showBreadcrumbs, breadcrumbs, onRoot, onCrumbClick }) {
  return (
    <div className="gd-title-wrap">
      <h1 className="gd-title">{title}</h1>

      {showBreadcrumbs && (
        <div className="gd-breadcrumbs" aria-label="Folder path">
          <button className="gd-crumb" type="button" onClick={onRoot}>
            My Drive
          </button>

          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id} className="gd-crumb-group">
              <span className="gd-crumb-sep">/</span>
              <button className="gd-crumb" type="button" onClick={() => onCrumbClick(index)}>
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
