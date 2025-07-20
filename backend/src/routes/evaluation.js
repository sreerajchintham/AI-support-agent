const express = require('express');
const router = express.Router();
const evaluationService = require('../services/evaluationService');

// Get all test questions
router.get('/questions', async (req, res) => {
  try {
    const questions = evaluationService.getAllQuestions();
    
    res.json({
      success: true,
      questions: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('❌ Failed to get test questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve test questions'
    });
  }
});

// Get questions by category
router.get('/questions/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questions = evaluationService.getQuestionsByCategory(category);
    
    res.json({
      success: true,
      category: category,
      questions: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('❌ Failed to get questions by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve questions by category'
    });
  }
});

// Get questions by difficulty
router.get('/questions/difficulty/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const questions = evaluationService.getQuestionsByDifficulty(difficulty);
    
    res.json({
      success: true,
      difficulty: difficulty,
      questions: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('❌ Failed to get questions by difficulty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve questions by difficulty'
    });
  }
});

// Evaluate a single question
router.post('/evaluate/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const questionIdNum = parseInt(questionId);
    
    if (isNaN(questionIdNum)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID'
      });
    }
    
    const result = await evaluationService.evaluateQuestion(questionIdNum);
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('❌ Failed to evaluate question:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Run full evaluation (all 50 questions)
router.post('/run-full', async (req, res) => {
  try {
    console.log('🚀 Starting full evaluation...');
    
    const results = await evaluationService.runFullEvaluation();
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error('❌ Failed to run full evaluation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run full evaluation'
    });
  }
});

// Get evaluation results
router.get('/results', async (req, res) => {
  try {
    const results = evaluationService.getEvaluationResults();
    
    res.json({
      success: true,
      results: results,
      count: results.length
    });
  } catch (error) {
    console.error('❌ Failed to get evaluation results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve evaluation results'
    });
  }
});

// Get evaluation statistics
router.get('/stats', async (req, res) => {
  try {
    const results = evaluationService.getEvaluationResults();
    const stats = evaluationService.calculateEvaluationStats(results);
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('❌ Failed to get evaluation stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve evaluation statistics'
    });
  }
});

// Evaluate multiple questions
router.post('/evaluate-batch', async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds)) {
      return res.status(400).json({
        success: false,
        error: 'questionIds must be an array'
      });
    }
    
    const results = [];
    
    for (const questionId of questionIds) {
      try {
        const result = await evaluationService.evaluateQuestion(questionId);
        results.push(result);
      } catch (error) {
        results.push({
          questionId,
          error: error.message,
          evaluation: {
            accuracy: 0,
            helpfulness: 0,
            citationQuality: 0,
            overall: 0
          }
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const stats = evaluationService.calculateEvaluationStats(results);
    
    res.json({
      success: true,
      results: results,
      stats: stats
    });
  } catch (error) {
    console.error('❌ Failed to evaluate batch:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate batch of questions'
    });
  }
});

// Get evaluation categories
router.get('/categories', async (req, res) => {
  try {
    const questions = evaluationService.getAllQuestions();
    const categories = [...new Set(questions.map(q => q.category))];
    
    const categoryStats = categories.map(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      return {
        category,
        count: categoryQuestions.length,
        difficulties: {
          easy: categoryQuestions.filter(q => q.difficulty === 'easy').length,
          medium: categoryQuestions.filter(q => q.difficulty === 'medium').length,
          hard: categoryQuestions.filter(q => q.difficulty === 'hard').length
        }
      };
    });
    
    res.json({
      success: true,
      categories: categoryStats
    });
  } catch (error) {
    console.error('❌ Failed to get categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
});

module.exports = router; 