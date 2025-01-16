// src/components/FullGradingForm.js
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FullGradingForm = () => {
  const [scores, setScores] = useState({});
  const [deductions, setDeductions] = useState({});
  const [comments, setComments] = useState({});

  const sections = {
    brand: {
      title: "Chosen Brand (5%)",
      items: [
        { id: "nzBrand", label: "Brand is from New Zealand", points: 2 },
        { id: "commonlySold", label: "Brand is commonly sold to NZ consumers", points: 1 },
        { id: "references", label: "Reference links provided as proof", points: 1 },
        { id: "introduction", label: "Clear and accurate introduction", points: 1 }
      ]
    },
    peste: {
      title: "Context - PESTE Analysis (20%)",
      items: [
        { id: "political", label: "Political - 3+ future-focused points with citations", points: 4 },
        { id: "economic", label: "Economic - 3+ future-focused points with citations", points: 4 },
        { id: "social", label: "Social - 3+ future-focused points with citations", points: 4 },
        { id: "technological", label: "Technological - 3+ future-focused points with citations", points: 4 },
        { id: "environmental", label: "Environmental - 3+ future-focused points with citations", points: 4 }
      ],
      deductions: [
        { id: "industryFocus", label: "Not focused on industry (-5%)", value: 5 },
        { id: "futureFocus", label: "Not future-focused (-5%)", value: 5 },
        { id: "citations", label: "Missing APA citations (-2% per section)", value: 2 }
      ]
    },
    swot: {
      title: "Company - SWOT Analysis (15%)",
      items: [
        { id: "strengths", label: "Strengths - 3+ points on internal capabilities", points: 3.75 },
        { id: "weaknesses", label: "Weaknesses - 3+ points on internal limitations", points: 3.75 },
        { id: "opportunities", label: "Opportunities - 3+ points on external possibilities", points: 3.75 },
        { id: "threats", label: "Threats - 3+ points on external challenges", points: 3.75 }
      ]
    },
    competition: {
      title: "Competition Analysis (20%)",
      items: [
        { id: "criteria", label: "5+ choice criteria with explanations", points: 6 },
        { id: "competitors", label: "5+ competitors with citations and annotations", points: 8 },
        { id: "chart", label: "Comparative chart (2+ criteria, 4+ competitors)", points: 6 }
      ]
    },
    collaborators: {
      title: "Collaborators (10%)",
      items: [
        { id: "suppliers", label: "Suppliers listed with citations", points: 3.33 },
        { id: "distributors", label: "Distributors listed with citations", points: 3.33 },
        { id: "promotions", label: "Promotions/partners listed with citations", points: 3.33 }
      ]
    },
    customers: {
      title: "Customers (10%)",
      items: [
        { id: "income", label: "Income level with citation", points: 2.5 },
        { id: "age", label: "Age range with citation", points: 2.5 },
        { id: "location", label: "Geographic location with citation", points: 2.5 },
        { id: "usage", label: "Usage patterns with citation", points: 2.5 }
      ]
    },
    presentation: {
      title: "Presentation (20%)",
      items: [
        { id: "subheaders", label: "Clear subheaders throughout", points: 5 },
        { id: "spacing", label: "Proper spacing between sections", points: 2 },
        { id: "pageLimit", label: "Within 3-page limit", points: 5 },
        { id: "noAppendices", label: "No appendices", points: 5 },
        { id: "bulletLength", label: "Bullet points ≤ 2 lines", points: 2 },
        { id: "paragraphLength", label: "Paragraphs ≤ 5 lines", points: 2 }
      ],
      deductions: [
        { id: "verbose", label: "Verbose writing (-5%)", value: 5 },
        { id: "missingCitations", label: "Missing citations (-2% each)", value: 2 },
        { id: "spelling", label: "Spelling errors (-1% each)", value: 1 },
        { id: "grammar", label: "Grammar errors (-1% each)", value: 1 }
      ]
    }
  };

  const handleCheckboxChange = (sectionId, itemId) => {
    setScores(prev => ({
      ...prev,
      [`${sectionId}-${itemId}`]: !prev[`${sectionId}-${itemId}`]
    }));
  };

  const handleDeductionChange = (sectionId, deductionId, count) => {
    setDeductions(prev => ({
      ...prev,
      [`${sectionId}-${deductionId}`]: count >= 0 ? count : 0
    }));
  };

  const handleCommentChange = (sectionId, comment) => {
    setComments(prev => ({
      ...prev,
      [sectionId]: comment
    }));
  };

  const calculateSectionScore = (section, sectionId) => {
    let score = 0;
    
    // Add points for checked items
    section.items.forEach(item => {
      if (scores[`${sectionId}-${item.id}`]) {
        score += item.points;
      }
    });
    
    // Subtract deductions
    if (section.deductions) {
      section.deductions.forEach(deduction => {
        const count = deductions[`${sectionId}-${deduction.id}`] || 0;
        score -= count * deduction.value;
      });
    }
    
    return Math.max(0, score);
  };

  const calculateTotalScore = () => {
    return Object.entries(sections).reduce((total, [sectionId, section]) => {
      return total + calculateSectionScore(section, sectionId);
    }, 0);
  };

  const generateFeedback = () => {
    let feedback = "# 5Cs Report Feedback\n\n";
    
    Object.entries(sections).forEach(([sectionId, section]) => {
      const sectionScore = calculateSectionScore(section, sectionId);
      feedback += `## ${section.title}\n`;
      feedback += `Score: ${sectionScore.toFixed(2)}%\n\n`;
      
      // Add checked items as achievements
      const achievements = section.items
        .filter(item => scores[`${sectionId}-${item.id}`])
        .map(item => `✓ ${item.label}`);
      
      if (achievements.length > 0) {
        feedback += "Achieved:\n" + achievements.join("\n") + "\n\n";
      }
      
      // Add missing items as areas for improvement
      const missing = section.items
        .filter(item => !scores[`${sectionId}-${item.id}`])
        .map(item => `- ${item.label}`);
      
      if (missing.length > 0) {
        feedback += "Areas for improvement:\n" + missing.join("\n") + "\n\n";
      }
      
      // Add deductions if any
      if (section.deductions) {
        const appliedDeductions = section.deductions
          .filter(d => deductions[`${sectionId}-${d.id}`] > 0)
          .map(d => `- ${d.label} (${deductions[`${sectionId}-${d.id}`]} instances)`);
        
        if (appliedDeductions.length > 0) {
          feedback += "Deductions:\n" + appliedDeductions.join("\n") + "\n\n";
        }
      }
      
      // Add section comment if exists
      if (comments[sectionId]) {
        feedback += `Comments: ${comments[sectionId]}\n\n`;
      }
      
      feedback += "---\n\n";
    });
    
    feedback += `# Total Score: ${calculateTotalScore().toFixed(2)}%`;
    return feedback;
  };

  const copyFeedback = () => {
    navigator.clipboard.writeText(generateFeedback());
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {Object.entries(sections).map(([sectionId, section]) => (
        <Card key={sectionId} className="w-full">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${sectionId}-${item.id}`}
                    checked={scores[`${sectionId}-${item.id}`] || false}
                    onChange={() => handleCheckboxChange(sectionId, item.id)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`${sectionId}-${item.id}`} className="flex-1">
                    {item.label} ({item.points}%)
                  </label>
                </div>
              ))}
              
              {section.deductions && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Deductions</h4>
                  {section.deductions.map(deduction => (
                    <div key={deduction.id} className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={deductions[`${sectionId}-${deduction.id}`] || 0}
                        onChange={(e) => handleDeductionChange(sectionId, deduction.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                      <label>{deduction.label}</label>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <textarea
                  placeholder="Additional comments for this section..."
                  value={comments[sectionId] || ''}
                  onChange={(e) => handleCommentChange(sectionId, e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
              </div>
              
              <div className="mt-2 text-right">
                Section Score: {calculateSectionScore(section, sectionId).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Total Score: {calculateTotalScore().toFixed(2)}%</h3>
            <Button onClick={copyFeedback} className="flex items-center space-x-2">
              <span>Copy Feedback</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullGradingForm;