class TasksController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  before_action :find_task, only: %i[show edit destroy]
  before_action :find_category, only: %i[create]

  def index
    @tasks = Task.all.select { |task| task.user == current_user }
    @tasks_categories = {}
    @tasks.each do |task|
      if @tasks_categories.include? task.category.label
        @tasks_categories[task.category.label].push(task)
      else
        @tasks_categories[task.category.label] = [task]
      end
    end
  end

  def show
    # @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    @task.user = current_user
    @task.category = @category
    if @task.save
      redirect_to tasks_path
    else
      render :new
    end
  end

  def edit
    # @task = Task.find(params[:id])
  end

  def update
    if @task.update
      redirect_to
    else
      render :edit
    end
  end

  def destroy
    # @task = Task.find(params[:id])
    @task.destroy
  end

  private

  def find_task
    @task = Task.find(params[:id])
  end

  def find_category
    @category = Category.find(params[:task][:category_id])
  end

  def task_params
    params.require(:task).permit(:title, :location, :start_at, :end_at, :due, :category)
  end
end
