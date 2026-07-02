import SearchBar from '../ui/SearchBar';
import { TASK_STATUS, PRIORITY } from '../../utils/constants';

export default function TaskFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  categories = [],
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between pb-2">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by task title or description..."
        />
      </div>

      {/* Select Filters Container */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
        >
          <option value="all">All Statuses</option>
          <option value={TASK_STATUS.PENDING}>Pending</option>
          <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
          <option value={TASK_STATUS.COMPLETED}>Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
        >
          <option value="all">All Priorities</option>
          <option value={PRIORITY.HIGH}>High</option>
          <option value={PRIORITY.MEDIUM}>Medium</option>
          <option value={PRIORITY.LOW}>Low</option>
        </select>

        {/* Category Filter */}
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Sort option */}
        <div className="w-px h-6 bg-white/[0.06] mx-1 hidden sm:block" />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/12 transition-all cursor-pointer focus:outline-none focus:border-primary-500/40"
        >
          <option value="dueDateAsc">Due Date: Soonest</option>
          <option value="dueDateDesc">Due Date: Latest</option>
          <option value="priorityDesc">Priority: High to Low</option>
          <option value="priorityAsc">Priority: Low to High</option>
          <option value="createdAtDesc">Newest Created</option>
          <option value="titleAsc">Title: A-Z</option>
        </select>
      </div>
    </div>
  );
}
