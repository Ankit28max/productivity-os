import SearchBar from '../ui/SearchBar';
import { HiOutlineFolder, HiOutlineArchive, HiTag } from 'react-icons/hi';

export default function NoteFilters({
  search,
  setSearch,
  showArchived,
  setShowArchived,
  selectedTag,
  setSelectedTag,
  tags = [],
}) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Search and Tabs Row */}
      <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search notes by title or content..."
          />
        </div>

        {/* Active/Archived Navigation tabs */}
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => {
              setShowArchived(false);
              setSelectedTag('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !showArchived
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <HiOutlineFolder className="h-4 w-4" />
            All Notes
          </button>
          <button
            onClick={() => {
              setShowArchived(true);
              setSelectedTag('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showArchived
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/10'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <HiOutlineArchive className="h-4 w-4" />
            Archived
          </button>
        </div>
      </div>

      {/* Dynamic Tags Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1 border-t border-white/[0.03] pt-3">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mr-1">
            Tags:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
              selectedTag === 'all'
                ? 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                : 'bg-transparent text-text-secondary border-transparent hover:bg-white/[0.03] hover:text-text-primary'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                selectedTag === tag
                  ? 'bg-primary-500/15 text-primary-400 border-primary-500/30'
                  : 'bg-transparent text-text-muted border-white/[0.03] hover:border-white/10 hover:text-text-secondary'
              }`}
            >
              <HiTag className="h-2.5 w-2.5 shrink-0" />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
