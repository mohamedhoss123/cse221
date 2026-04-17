        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-72 flex-shrink-0 transition-all duration-300">
            <div className="bg-[var(--expressive-surface)] rounded-2xl p-6 border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] sticky top-8">
              <div className="flex items-center justify-between mb-6 border-b-2 border-[var(--expressive-secondary)] pb-4">
                <h2 className="text-xl font-bold text-[var(--expressive-text)]">Filters</h2>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-bold text-[var(--expressive-primary)] hover:text-[var(--expressive-primary-hover)] underline underline-offset-2 decoration-2"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Date Range */}
                <div className="space-y-3">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Check-in Date</Label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                    <input
                      type="date"
                      value={filters.checkIn || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, checkIn: e.target.value })}
                      min={format(today, 'yyyy-MM-dd')}
                      className="w-full pl-10 pr-3 py-2.5 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all text-[var(--expressive-text)] hover:shadow-[2px_2px_0_0_var(--expressive-secondary)]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Check-out Date</Label>
                  <div className="relative group">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--expressive-text-muted)] group-focus-within:text-[var(--expressive-primary)] transition-colors" />
                    <input
                      type="date"
                      value={filters.checkOut || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, checkOut: e.target.value })}
                      min={filters.checkIn ? format(new Date(filters.checkIn), 'yyyy-MM-dd') : format(tomorrow, 'yyyy-MM-dd')}
                      disabled={!filters.checkIn}
                      className="w-full pl-10 pr-3 py-2.5 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all text-[var(--expressive-text)] hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    />
                  </div>
                  {filters.checkIn && !filters.checkOut && (
                    <p className="text-xs font-semibold text-[var(--expressive-warning)]">! Please select check-out date</p>
                  )}
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Room Type</Label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        type: value === 'all' ? undefined : value as any,
                      })
                    }
                  >
                    <SelectTrigger className="w-full py-6 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] data-[state=open]:shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl font-mono">
                      <SelectItem value="all" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">All Types</SelectItem>
                      <SelectItem value="standard" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Standard</SelectItem>
                      <SelectItem value="deluxe" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Deluxe</SelectItem>
                      <SelectItem value="suite" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Suite</SelectItem>
                      <SelectItem value="penthouse" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Max Price</Label>
                  <Select
                    value={filters.maxPrice ? `${filters.maxPrice}` : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        maxPrice: value === 'all' ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full py-6 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] data-[state=open]:shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl font-mono">
                      <SelectItem value="all" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Any Price</SelectItem>
                      <SelectItem value="200" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Under $200</SelectItem>
                      <SelectItem value="400" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Under $400</SelectItem>
                      <SelectItem value="600" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Under $600</SelectItem>
                      <SelectItem value="1000" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Under $1000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Guests</Label>
                  <Select
                    value={filters.capacity ? `${filters.capacity}` : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        capacity: value === 'all' ? undefined : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full py-6 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] data-[state=open]:shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                      <SelectValue placeholder="Any capacity" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl font-mono">
                      <SelectItem value="all" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Any Capacity</SelectItem>
                      <SelectItem value="1" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">1 Guest</SelectItem>
                      <SelectItem value="2" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">2 Guests</SelectItem>
                      <SelectItem value="3" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">3 Guests</SelectItem>
                      <SelectItem value="4" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">4+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label className="text-[var(--expressive-text)] font-bold text-sm">Availability</Label>
                  <Select
                    value={filters.available ? (filters.available === true ? 'available' : 'all') : 'all'}
                    onValueChange={(value) =>
                      handleFiltersChange({
                        ...filters,
                        available: value === 'available' ? true : undefined,
                      })
                    }
                  >
                    <SelectTrigger className="w-full py-6 bg-[var(--expressive-background)] border-2 border-[var(--expressive-secondary)] rounded-xl font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[var(--expressive-accent)] transition-all hover:shadow-[2px_2px_0_0_var(--expressive-secondary)] data-[state=open]:shadow-[2px_2px_0_0_var(--expressive-secondary)]">
                      <SelectValue placeholder="All rooms" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-[var(--expressive-secondary)] shadow-[4px_4px_0_0_var(--expressive-secondary)] rounded-xl font-mono">
                      <SelectItem value="all" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">All Rooms</SelectItem>
                      <SelectItem value="available" className="focus:bg-[var(--expressive-accent)] focus:text-white cursor-pointer py-2">Available Now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {Object.keys(filters).length > 0 && (
                  <div className="pt-6 border-t-2 border-[var(--expressive-secondary)]">
                    <p className="text-sm font-bold text-[var(--expressive-text)] mb-3">Active Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.type && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--expressive-primary)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] rounded-full text-xs font-bold uppercase tracking-wide">
                          {filters.type}
                          <button
                            onClick={() => handleFiltersChange({ ...filters, type: undefined })}
                            className="hover:text-[var(--expressive-accent)] focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-colors"
                            aria-label="Remove filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                      {filters.maxPrice && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--expressive-success)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] rounded-full text-xs font-bold uppercase tracking-wide">
                          ≤ ${filters.maxPrice}
                          <button
                            onClick={() => handleFiltersChange({ ...filters, maxPrice: undefined })}
                            className="hover:text-black focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-colors"
                            aria-label="Remove filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                      {filters.capacity && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--expressive-warning)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] rounded-full text-xs font-bold uppercase tracking-wide">
                          {filters.capacity}+ guests
                          <button
                            onClick={() => handleFiltersChange({ ...filters, capacity: undefined })}
                            className="hover:text-black focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-colors"
                            aria-label="Remove filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                      {filters.checkIn && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--expressive-text)] text-white border-2 border-[var(--expressive-secondary)] shadow-[2px_2px_0_0_var(--expressive-secondary)] rounded-full text-xs font-bold uppercase tracking-wide">
                          {format(new Date(filters.checkIn), 'MMM d')}
                          <button
                            onClick={() => handleFiltersChange({ ...filters, checkIn: undefined, checkOut: undefined })}
                            className="hover:text-[var(--expressive-accent)] focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-colors"
                            aria-label="Remove filter"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
