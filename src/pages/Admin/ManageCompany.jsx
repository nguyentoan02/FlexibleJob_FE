import AdminLayout from "@/components/Layout/AdminLayout";
import { useEffect, useState } from "react";
import { fetchCompanyApprovalStats, fetchCompanyList, updateCompanyApproval, deleteCompany } from "@/api/adminCompany";
import { useAuth } from "@/hooks/useAuth";
import { Filter, MapPin, Search, Building, CheckCircle, Clock, XCircle, Eye, Check, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageCompany() {
    const { token } = useAuth();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [allCompanies, setAllCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState([]);
  // Thêm state cho các option động
  const [locationOptions, setLocationOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companySizeOptions, setCompanySizeOptions] = useState([]);
  // Thêm state cho tab filter
  const [activeTab, setActiveTab] = useState('all');

  // Khi load trang, lấy toàn bộ company (không filter)
  useEffect(() => {
    async function getAllCompanies() {
      setLoading(true);
      try {
        const response = await fetchCompanyList(token, {}); // không truyền filter
        // API trả về data trong payload array
        const companiesData = response?.payload || [];
        console.log('Companies response:', response);
        console.log('Companies data:', companiesData);
        setAllCompanies(companiesData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setAllCompanies([]);
        setCompanies([]);
      }
      setLoading(false);
    }
    if (token) getAllCompanies();
  }, [token]);

  // Lấy lại thống kê company stats
  useEffect(() => {
    async function getStats() {
      try {
        const response = await fetchCompanyApprovalStats(token);
        // API trả về data trong payload
        const statsData = response?.payload || { total: 0, approved: 0, pending: 0, inActive: 0 };
        console.log('Stats response:', response);
        console.log('Stats data:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ total: 0, approved: 0, pending: 0, inActive: 0 });
      }
    }
    if (token) getStats();
  }, [token]);

  // Khi filter, chỉ cập nhật companies (không cập nhật allCompanies)
  useEffect(() => {
    if (!Array.isArray(allCompanies)) {
      setCompanies([]);
      return;
    }
    
    let filteredCompanies = allCompanies;
    
             // Filter theo tab status
         if (activeTab !== 'all') {
           filteredCompanies = allCompanies.filter(company => {
             // Nếu user bị banned thì chỉ hiển thị trong tab inactive
             if (company.user?.isBanned === true) {
               return activeTab === 'inactive';
             }
             // Nếu chưa approved thì hiển thị trong tab pending
             if (company.isApproved === false) {
               return activeTab === 'pending';
             }
             // Còn lại là active
             return activeTab === 'active';
           });
         }
    
    // Filter theo location, industry, size
    if (
      selectedLocations.length === 0 &&
      selectedIndustries.length === 0 &&
      selectedCompanySizes.length === 0
    ) {
      setCompanies(filteredCompanies);
    } else {
      setCompanies(
        filteredCompanies.filter(company =>
          (selectedLocations.length === 0 || selectedLocations.includes(company.location)) &&
          (selectedIndustries.length === 0 || selectedIndustries.includes(company.industry)) &&
          (selectedCompanySizes.length === 0 || selectedCompanySizes.includes(company.companySize))
        )
      );
    }
  }, [selectedLocations, selectedIndustries, selectedCompanySizes, allCompanies, activeTab]);

  // Các option filter luôn lấy từ allCompanies
  useEffect(() => {
    if (!Array.isArray(allCompanies)) {
      setLocationOptions([]);
      setIndustryOptions([]);
      setCompanySizeOptions([]);
      return;
    }
    
    const locations = Array.from(new Set(allCompanies.map(c => c.location).filter(Boolean)));
    const industries = Array.from(new Set(allCompanies.map(c => c.industry).filter(Boolean)));
    const companySizes = Array.from(new Set(allCompanies.map(c => c.companySize).filter(Boolean)));
    setLocationOptions(locations);
    setIndustryOptions(industries);
    setCompanySizeOptions(companySizes);
  }, [allCompanies]);

  // Search local
  useEffect(() => {
    if (!Array.isArray(allCompanies)) {
      setCompanies([]);
      return;
    }
    
    if (!searchTerm) {
      setCompanies(allCompanies);
    } else {
      setCompanies(
        allCompanies.filter(company =>
          company.companyName && company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allCompanies]);

  const navigate = useNavigate();

    return (
        <AdminLayout>
            <div className="p-8">
        <h1 className="text-4xl font-bold mb-2">Company Management</h1>
        <div className="flex items-center text-sm mb-8">
          <span className="text-gray-500">Admin</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-green-500">Companies</span>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 rounded-xl p-6 flex items-center gap-4 text-white relative">
            <div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="font-medium mt-1">Total Companies</div>
            </div>
            <Building size={56} className="absolute right-6 bottom-4 opacity-20" />
          </div>
          <div className="bg-green-500 rounded-xl p-6 flex items-center gap-4 text-white relative">
            <div>
              <div className="text-3xl font-bold">{stats.approved}</div>
              <div className="font-medium mt-1">Active Companies</div>
            </div>
            <CheckCircle size={56} className="absolute right-6 bottom-4 opacity-20" />
          </div>
          <div className="bg-yellow-400 rounded-xl p-6 flex items-center gap-4 text-white relative">
            <div>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="font-medium mt-1">Pending Approval</div>
                    </div>
            <Clock size={56} className="absolute right-6 bottom-4 opacity-20" />
                                        </div>
          <div className="bg-red-500 rounded-xl p-6 flex items-center gap-4 text-white relative">
                                        <div>
              <div className="text-3xl font-bold">{stats.inActive}</div>
              <div className="font-medium mt-1">Inactive Companies</div>
            </div>
            <XCircle size={56} className="absolute right-6 bottom-4 opacity-20" />
                                        </div>
                                    </div>
        {/* Search & Filter Bar - Redesigned */}
        <div className="bg-white rounded-lg shadow px-6 py-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} className="text-gray-400" />
                                            </span>
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-gray-700 font-medium">
                <Filter size={20} color="#6b7280" />
                Filter
              </button>
            </div>
                                        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <div key="location">
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                Location
              </label>
              <select
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedLocations.length === 0 ? "All Locations" : selectedLocations[0]}
                onChange={e => setSelectedLocations(e.target.value === "All Locations" ? [] : [e.target.value])}
              >
                <option value="All Locations">All Locations</option>
                {locationOptions.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
                                        </div>
            {/* Industry */}
            <div key="industry">
              <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
              <select
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedIndustries.length === 0 ? "All Industries" : selectedIndustries[0]}
                onChange={e => setSelectedIndustries(e.target.value === "All Industries" ? [] : [e.target.value])}
              >
                <option value="All Industries">All Industries</option>
                {industryOptions.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
                                        </div>
            {/* Company Size */}
            <div key="companySize">
              <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
              <select
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedCompanySizes.length === 0 ? "All Sizes" : selectedCompanySizes[0]}
                onChange={e => setSelectedCompanySizes(e.target.value === "All Sizes" ? [] : [e.target.value])}
              >
                <option value="All Sizes">All Sizes</option>
                {companySizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
                                        </div>
                                    </div>
                                </div>
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-4">
          <button 
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All <span className={`rounded-full px-2 ml-1 ${
              activeTab === 'all' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {allCompanies.length}
                                        </span>
          </button>
          <button 
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'active' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active <span className={`rounded-full px-2 ml-1 ${
              activeTab === 'active' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {allCompanies.filter(c => c.user?.isBanned !== true && c.isApproved !== false).length}
                                        </span>
          </button>
          <button 
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pending' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending <span className={`rounded-full px-2 ml-1 ${
              activeTab === 'pending' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {allCompanies.filter(c => c.user?.isBanned !== true && c.isApproved === false).length}
                                        </span>
          </button>
          <button 
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'inactive' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive <span className={`rounded-full px-2 ml-1 ${
              activeTab === 'inactive' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {allCompanies.filter(c => c.user?.isBanned === true).length}
            </span>
          </button>

                                        </div>
        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">COMPANY</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">INDUSTRY</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">LOCATION</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">JOBS</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">STATUS</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : !Array.isArray(companies) || companies.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No companies found.</td></tr>
              ) : (
                companies.map((company, idx) => (
                  <tr key={company.id || idx} className="hover:bg-gray-50 border-b border-black/20">
                    <td className="px-4 py-4 flex items-center gap-3">
                      {company.imageUrl && (
                        <img src={company.imageUrl} alt="avatar" className="w-12 h-12 rounded object-cover border" />
                      )}
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {company.companyName}
                          {company.verified && (
                            <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
                              Verified
                                        </span>
                                    )}
                          {company.featured && (
                            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded text-xs font-medium">
                              Featured
                                        </span>
                                    )}
                                </div>
                        {company._id && (
                          <div className="text-xs text-gray-400">
                            ID: {String(company._id).slice(0, 6)}
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">{company.industry || '-'}</td>
                    <td className="px-4 py-4 flex items-center gap-1 text-gray-600">
                      <MapPin size={16} className="inline-block text-gray-400" />
                      {company.location || '-'}
                    </td>
                    <td className="px-4 py-4">{company.jobCount ?? 0}</td>
                    <td className="px-4 py-4">
                      {company.user?.isBanned === true ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>
                      ) : company.isApproved === false ? (
                        <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Pending</span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-4 flex gap-3">
                      <button 
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded" 
                        title="View" 
                                onClick={() => {
                          console.log('Navigating to company profile:', company._id);
                          navigate(`/admin/company-profile/${company._id}`);
                        }}
                      >
                        <Eye size={20} />
                      </button>
                      {company.user?.isBanned ? (
                        <button 
                          className="text-red-500 hover:bg-red-50 p-2 rounded" 
                          title="Delete" 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this company?')) {
                              try {
                                await deleteCompany(company._id, token);
                                window.location.reload();
                              } catch (error) {
                                console.error("Error deleting company:", error);
                                alert("Failed to delete company.");
                              }
                            }
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                      ) : (
                        <>
                          <button 
                            className="text-green-500 hover:bg-green-50 p-2 rounded" 
                            title="Approve" 
                            onClick={async () => {
                              await updateCompanyApproval({ companyId: company._id, isApproved: true, token });
                              window.location.reload();
                            }}
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            className="text-red-500 hover:bg-red-50 p-2 rounded" 
                            title="Reject" 
                            onClick={async () => {
                              await updateCompanyApproval({ companyId: company._id, isApproved: false, token });
                              window.location.reload();
                            }}
                          >
                            <X size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
                        </div>
            </div>
        </AdminLayout>
    );
} 