import { Metadata } from "next";
import { getBlogPosts } from "@/lib/data/blog";
import { AnnouncementsGrid } from "@/components/toynami/announcements-grid";
import { YouTubeSection } from "@/components/toynami/youtube-section";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Announcements | Toynami",
  description: "Latest news, product launches, and updates from Toynami",
};

interface PageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function AnnouncementsPage({
  searchParams: sP,
}: PageProps) {
  const searchParams = await sP;

  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 12; // 12 posts per page

  // Fetch blog posts with pagination
  const { posts, totalPages, totalCount } = await getBlogPosts({
    page: currentPage,
    pageSize,
    featured: false, // Show all posts, not just featured
  });

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed before range
      if (startPage > 2) {
        pages.push("...");
      }

      // Add pages in range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed after range
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="container mx-auto px-4">
      {/* Page Header */}
      <div className="text-center mb-12 pt-16">
        <h1 className="text-4xl font-bold mb-4">ANNOUNCEMENTS</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay up to date with the latest news, product releases, and exclusive
          announcements from Toynami
        </p>
      </div>

      {/* Announcements Grid */}
      <div className="announcements-page pb-12">
        <AnnouncementsGrid
          posts={posts}
          showViewAll={false}
          gridClassName="announcements-grid" // This applies the multi-column grid layout
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination mt-12">
            <Pagination>
              <PaginationContent className="pagination-list">
                {/* Previous Button */}
                <PaginationItem className="pagination-item pagination-item--previous">
                  {currentPage > 1 ? (
                    <PaginationPrevious
                      href={`/announcements${
                        currentPage === 2 ? "" : `?page=${currentPage - 1}`
                      }`}
                      className="pagination-link"
                    />
                  ) : (
                    <span className="pagination-link opacity-50 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum, index) => (
                  <PaginationItem
                    key={index}
                    className={`pagination-item ${
                      pageNum === currentPage ? "pagination-item--current" : ""
                    }`}
                  >
                    {pageNum === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={
                          pageNum === 1
                            ? "/announcements"
                            : `/announcements?page=${pageNum}`
                        }
                        className="pagination-link"
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {/* Next Button */}
                <PaginationItem className="pagination-item pagination-item--next">
                  {currentPage < totalPages ? (
                    <PaginationNext
                      href={`/announcements?page=${currentPage + 1}`}
                      className="pagination-link"
                    />
                  ) : (
                    <span className="pagination-link opacity-50 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Results Info */}
        {totalCount > 0 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            announcements
          </div>
        )}
      </div>

      {/* YouTube Section */}
      <div className="mb-12">
        <YouTubeSection />
      </div>
    </div>
  );
}
