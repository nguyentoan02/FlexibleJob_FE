import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useAuth } from "../../hooks/useAuth";
import { MapPin, Briefcase, Users, ExternalLink, Shield, Star, ChevronLeft, XCircle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { fetchCompanyDetails, updateCompanyApproval, deleteCompany } from "../../api/adminCompany";

export default function CompanyProfileDetail() {
  const { companyId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetchCompanyDetails(companyId, token);
        console.log('Company details response:', response);
        
        const companyData = response?.payload?.company;
        const jobsData = response?.payload?.jobs || [];
        
        console.log('Company data:', companyData);
        console.log('Jobs data:', jobsData);
        
        if (!companyData) {
          setError("Company not found");
          setLoading(false);
          return;
        }
        
        setCompany({
          id: companyData._id,
          name: companyData.companyName,
          logo: companyData.imageUrl,
          location: companyData.location,
          industry: companyData.industry,
          size: companyData.companySize,
          address: companyData.address,
          website: companyData.website,
          contact: companyData.email,
          description: companyData.aboutUs,
          verified: companyData.verified,
          featured: companyData.featured,
          status: companyData.user?.isBanned === true ? 'inactive' : (companyData.isApproved === false ? 'pending' : 'active'),
          joinDate: companyData.createdAt ? new Date(companyData.createdAt).toLocaleDateString() : '',
          openJobs: jobsData.length,
          jobs: jobsData,
          user: companyData.user,
          identityImage: companyData.identityImage || [],
          albumImage: companyData.albumImage || [],
          socialLinks: {
            linkedin: companyData.linkedinUrl,
            facebook: companyData.facebookUrl,
            website: companyData.website,
          },
        });
        setError("");
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError("Error loading company data");
      }
      setLoading(false);
    }
    
    if (companyId && token) {
      fetchData();
    }
  }, [companyId, token, reloadTrigger]);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
    if (status === 'inactive') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>;
    return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Active</span>;
  };

  const onUpdateStatus = async (id, newStatus) => {
    try {
      await updateCompanyApproval({ companyId: id, isApproved: newStatus === 'active', token });
      // Trigger reload to get updated data
      setReloadTrigger(prev => prev + 1);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteCompany = async () => {
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      try {
        await deleteCompany(company.id, token);
        navigate('/admin/companies');
      } catch (err) {
        alert('Failed to delete company');
      }
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-8 text-red-500">{error}</div></AdminLayout>;
  if (!company) return null;

  return (
    <AdminLayout>
      <div className="p-8 h-full bg-gray-50">
        <div className="mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">Company Details</h1>
          </div>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500">Admin</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">Companies</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-500">Details</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-center">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-2xl font-semibold">{company.name}</h2>
                      {company.verified && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Shield size={12} className="mr-1" />
                          Verified
                        </span>
                      )}
                      {company.featured && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Star size={12} className="mr-1" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Briefcase size={16} className="mr-1" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Users size={16} className="mr-1" />
                      <span>User Status: {company.user?.isBanned === true ? 'Inactive' : 'Active'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="mb-2">{getStatusBadge(company.status)}</div>
                  <span className="text-sm text-gray-500">ID: {company.id}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    Joined: {company.joinDate}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 pb-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Company Description
                </h3>
                <p className="text-gray-800 mb-4">{company.description}</p>
              </div>
              <div className="border-t border-gray-100 pt-4 pb-2">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <Users size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Company Size</span>
                      <p>{company.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <MapPin size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Address</span>
                      <p>{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <ExternalLink size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Website</span>
                      <p className="text-blue-500 hover:underline">
                        {company.website}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <Users size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Contact Person
                      </span>
                      <p>{company.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Identity Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Identity Documents
              </h3>
              {company.identityImage && company.identityImage.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 min-w-max">
                    {company.identityImage.map((image, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={image}
                          alt={`Identity document ${index + 1}`}
                          className="w-64 h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          ID {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No identity documents uploaded</p>
              )}
            </div>
            {/* Album Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Company Album
              </h3>
              {company.albumImage && company.albumImage.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 min-w-max">
                    {company.albumImage.map((image, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={image}
                          alt={`Album image ${index + 1}`}
                          className="w-64 h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No album images uploaded</p>
              )}
            </div>
            {/* Posted Jobs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Posted Jobs ({company.openJobs})
                </h2>
              </div>
              {company.jobs && company.jobs.length > 0 ? (
                <div className="space-y-4">
                  {company.jobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{job.level}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{job.jobType}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{job.location}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{job.salary && job.salary.min} - {job.salary && job.salary.max} {job.salary && job.salary.currency}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Applicants: {job.applicants ? job.applicants.length : 0}</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  This company has not posted any jobs yet
                </div>
              )}
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Social Media</h3>
              {company.socialLinks ? (
                <div className="space-y-3">
                  {Object.entries(company.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={`https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No social media information available
                </p>
              )}
            </div>
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {company.user?.isBanned ? (
                  <button 
                    onClick={handleDeleteCompany}
                    className="w-full border border-gray-300 text-red-600 py-2 px-4 rounded-md hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete Company
                  </button>
                ) : (
                  <>
                    {company.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(company.id, 'active')}
                          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center"
                        >
                          <CheckCircle size={18} className="mr-2" />
                          Approve Company
                        </button>
                        <button
                          onClick={() => onUpdateStatus(company.id, 'inactive')}
                          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center"
                        >
                          <XCircle size={18} className="mr-2" />
                          Reject Approval
                        </button>
                      </>
                    )}
                    {company.status === 'active' && (
                      <button
                        onClick={() => onUpdateStatus(company.id, 'inactive')}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center"
                      >
                        <XCircle size={18} className="mr-2" />
                        Deactivate Company
                      </button>
                    )}
                    {company.status === 'inactive' && (
                      <button
                        onClick={() => onUpdateStatus(company.id, 'active')}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center"
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Activate Company
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 